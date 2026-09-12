/**
 * Model-facing management tools. The model can list configured MCP servers and
 * add, remove, enable, or disable one; every mutation goes through the same
 * registry port the browser card writes, so chat and UI edits cannot diverge.
 *
 * The tools are thin: they shape and validate arguments, delegate to the port,
 * and return the fresh status table as JSON text. Connection lifetime belongs
 * to the plugin's reconciliation loop, not to a tool call.
 *
 * @module @ctl456/dsh-mcp-manager/tools
 */

import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ToolDefinition } from '@deepseek-ai/dsh-tools'
import type { JsonValue } from '@deepseek-ai/dsh-util-values'
import { DEFAULT_TOOL_CALL_TIMEOUT_MS, type McpServerEntry, type McpTransport } from './servers.ts'

/** Live status of one configured server, as reported to the model and the card. */
export interface ServerStatus {
  /** The `serverName` namespace. */
  readonly name: string
  /** Selected transport. */
  readonly transport: McpTransport
  /** Whether reconciliation keeps a live client mounted. */
  readonly enabled: boolean
  /** Whether the server currently registers at least one tool. */
  readonly connected: boolean
  /** Where the server connects: a command line, or the endpoint URL. */
  readonly target: string
  /** Raw MCP tool names currently bridged under `mcp__<name>__`. */
  readonly tools: readonly string[]
  /** Configuration problems that keep this entry from mounting; empty when mountable. */
  readonly problems: readonly string[]
}

/** The registry operations the tools and the card both drive. */
export interface ManagerPort {
  /** @returns the current status of every configured server, in registry order. */
  list(): readonly ServerStatus[]
  /** Add a server, or replace the entry with the same `name`. */
  upsert(entry: McpServerEntry): Promise<void>
  /** Remove the server with this `name`; a missing name is a no-op. */
  remove(name: string): Promise<void>
  /** Enable or disable one server without changing its other fields. */
  setEnabled(name: string, enabled: boolean): Promise<void>
}

/** Tool output declaration shared by every management tool: pretty JSON text. */
interface JsonTextOutput {
  /** Canonical output kind: an arbitrary JSON value, not a tool-specific schema. */
  schema: { type: 'json' }
  /** Render the canonical value as indented JSON text for the model. */
  render(args: unknown, value: JsonValue): [{ type: 'text'; text: string }]
}

/** Build the shared pretty-JSON output declaration. */
function jsonOutput(): JsonTextOutput {
  return {
    schema: { type: 'json' },
    render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
  }
}

/** Whether every element of an unknown array is a string. */
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

/** Coerce a JSON argument into an array of strings, or reject it. */
function stringArray(value: unknown, field: string): string[] {
  if (value === undefined) return []
  /* v8 ignore next -- the `args` tool schema rejects a non-string array before execute runs */
  if (!isStringArray(value)) throw new Error(`"${field}" must be an array of strings`)
  return [...value]
}

/** Coerce a JSON argument into a string-to-string record, or reject it. */
function stringRecord(value: unknown, field: string): Record<string, string> {
  if (value === undefined) return {}
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`"${field}" must be an object mapping names to strings`)
  }
  const record: Record<string, string> = {}
  for (const [key, item] of Object.entries(value)) {
    if (typeof item !== 'string') throw new Error(`"${field}.${key}" must be a string`)
    record[key] = item
  }
  return record
}

/** Build a registry entry from one add call, filling transport defaults. */
function entryFromArgs(args: {
  readonly name: string
  readonly transport: McpTransport
  readonly enabled?: boolean
  readonly command?: string
  readonly args?: unknown
  readonly env?: unknown
  readonly cwd?: string
  readonly url?: string
  readonly headers?: unknown
  readonly toolCallTimeoutMs?: number
}): McpServerEntry {
  return {
    name: args.name,
    transport: args.transport,
    enabled: args.enabled ?? true,
    command: args.command ?? '',
    args: stringArray(args.args, 'args'),
    env: stringRecord(args.env, 'env'),
    cwd: args.cwd ?? '',
    url: args.url ?? '',
    headers: stringRecord(args.headers, 'headers'),
    toolCallTimeoutMs: args.toolCallTimeoutMs ?? DEFAULT_TOOL_CALL_TIMEOUT_MS,
  }
}

/** Shared parameter description for the server namespace. */
const NAME_DESCRIPTION =
  'Stable local namespace for this server (the model sees its tools as mcp__<name>__<tool>). '
  + 'Use [A-Za-z0-9_-], 1-32 characters; unique among configured servers.'

/**
 * Build the management tools for one registry port.
 * @param port - the live registry the tools read and mutate.
 * @returns registry-ready tool definitions, in a stable order.
 */
export function managerTools(port: ManagerPort): ToolDefinition[] {
  const list = defineTool({
    name: 'mcp_manager_list',
    description:
      'List the MCP servers configured for this harness with their transport, enabled state, connection status, '
      + 'and the tools each one currently contributes. Use it before adding or removing a server.',
    parameters: {},
    output: jsonOutput(),
    execute(): Promise<JsonValue> {
      return Promise.resolve({ servers: port.list() } as unknown as JsonValue)
    },
  })

  const add = defineTool({
    name: 'mcp_manager_add',
    description:
      'Add an MCP server, or replace the entry with the same name. The harness mounts it immediately and its tools '
      + 'become callable as `mcp__<name>__<tool>`. For the stdio transport give command/args/env/cwd; for streamable-http '
      + 'give url/headers. Env values and headers carry credentials; prefer referencing a secret over pasting it.',
    parameters: {
      name: { type: 'string', required: true, description: NAME_DESCRIPTION },
      transport: {
        type: 'string',
        required: true,
        enum: ['stdio', 'streamable-http'],
        description: 'stdio spawns a local program; streamable-http connects to a service.',
      },
      enabled: { type: 'boolean', description: 'Whether to mount the server now; defaults to true.' },
      command: { type: 'string', description: 'stdio: executable to spawn, e.g. "npx".' },
      args: { type: 'array', items: { type: 'string' }, description: 'stdio: arguments passed without shell interpolation.' },
      env: { type: 'json', description: 'stdio: extra environment variables as a string-to-string object.' },
      cwd: { type: 'string', description: 'stdio: child working directory; omit to inherit.' },
      url: { type: 'string', description: 'streamable-http: absolute http(s) MCP endpoint URL.' },
      headers: { type: 'json', description: 'streamable-http: extra request headers as a string-to-string object.' },
      toolCallTimeoutMs: { type: 'number', description: 'Per-tool-call timeout in milliseconds; defaults to 60000.' },
    },
    output: jsonOutput(),
    async execute(args): Promise<JsonValue> {
      await port.upsert(entryFromArgs(args))
      return { servers: port.list() } as unknown as JsonValue
    },
  })

  const remove = defineTool({
    name: 'mcp_manager_remove',
    description: 'Remove a configured MCP server. Its tools stop being callable immediately and the stored entry is deleted.',
    parameters: {
      name: { type: 'string', required: true, description: NAME_DESCRIPTION },
    },
    output: jsonOutput(),
    async execute(args): Promise<JsonValue> {
      await port.remove(args.name)
      return { servers: port.list() } as unknown as JsonValue
    },
  })

  const setEnabled = defineTool({
    name: 'mcp_manager_set_enabled',
    description:
      'Enable or disable a configured MCP server without deleting it. Disabling unmounts the client and removes its '
      + 'tools from the model view; enabling mounts it again.',
    parameters: {
      name: { type: 'string', required: true, description: NAME_DESCRIPTION },
      enabled: { type: 'boolean', required: true, description: 'True to mount the server, false to unmount it.' },
    },
    output: jsonOutput(),
    async execute(args): Promise<JsonValue> {
      await port.setEnabled(args.name, args.enabled)
      return { servers: port.list() } as unknown as JsonValue
    },
  })

  return [list, add, remove, setEnabled]
}
