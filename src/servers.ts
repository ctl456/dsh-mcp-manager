/**
 * Declarative MCP server registry: the persisted value shape, its Schemastery
 * schema, cross-field validation, the projection into a `dsh-mcp-client`
 * config, and the pure reconciliation plan the plugin applies to the live
 * child clients.
 *
 * The registry is one module because every consumer — the settings section,
 * the model tools, the browser card, and the mount/unmount loop — must agree
 * on one value shape and one naming rule. `name` is the `serverName` namespace
 * `dsh-mcp-client` uses, so the public tool prefix `mcp__<name>__` stays stable
 * across reloads.
 *
 * @module @ctl456/dsh-mcp-manager/servers
 */

import z from '@deepseek-ai/schemastery'
import type * as McpClient from '@deepseek-ai/dsh-mcp-client'

/** Transports `dsh-mcp-client` can bridge. */
export type McpTransport = 'stdio' | 'streamable-http'

/**
 * One configured MCP server. A single entry carries the fields of both
 * transports; only the fields the selected `transport` reads are meaningful,
 * and `validateServerEntry` enforces the cross-field requirement the schema
 * cannot express per-branch.
 */
export interface McpServerEntry {
  /** Stable local namespace; the public tool prefix is `mcp__<name>__`. */
  name: string
  /** Which transport connects this server. */
  transport: McpTransport
  /** Whether the manager keeps a live client mounted for this server. */
  enabled: boolean
  /** stdio: executable to spawn. */
  command: string
  /** stdio: spawn arguments, passed without shell interpolation. */
  args: string[]
  /** stdio: extra environment variables merged over the scrubbed ambient env. */
  env: Record<string, string>
  /** stdio: working directory for the child process; empty inherits the host cwd. */
  cwd: string
  /** streamable-http: MCP endpoint URL. */
  url: string
  /** streamable-http: extra request headers. */
  headers: Record<string, string>
  /** Per-`tools/call` timeout passed to `dsh-mcp-client`. */
  toolCallTimeoutMs: number
}

/** The valid `serverName` namespace, matching `dsh-mcp-client`'s own pattern. */
export const SERVER_NAME_PATTERN = /^[A-Za-z0-9_-]{1,32}$/

/** Default per-tool-call timeout, matching `dsh-mcp-client`. */
export const DEFAULT_TOOL_CALL_TIMEOUT_MS = 60_000

/** Per-entry schema; fields default to the empty/zero value of their transport. */
const McpServerEntrySchema = z.object({
  name: z.string().required().pattern(SERVER_NAME_PATTERN),
  transport: z.union([z.const('stdio'), z.const('streamable-http')]).required(),
  enabled: z.boolean().default(true),
  command: z.string().default(''),
  args: z.array(String).default([]),
  env: z.dict(String).default({}),
  cwd: z.string().default(''),
  url: z.string().default(''),
  headers: z.dict(String).default({}),
  toolCallTimeoutMs: z.number().step(1).min(1).default(DEFAULT_TOOL_CALL_TIMEOUT_MS),
})

/** Plugin configuration and settings-section value: the server registry. */
export interface Config {
  /** Configured MCP servers, in registration order. */
  servers: McpServerEntry[]
}

/** Schemastery schema for {@link Config}; also the settings-section schema. */
export const Config: z<Config> = z.object({
  servers: z.array(McpServerEntrySchema).default([]),
})

/**
 * Check the constraints the per-entry schema cannot express.
 *
 * The schema sees each field alone; a stdio entry must carry a command, and a
 * streamable-http entry must carry an absolute HTTP(S) URL. Returning every
 * problem instead of the first lets an editor fix a form in one pass.
 * @param entry - the resolved registry entry to check.
 * @returns every problem found, in field order; empty when the entry is mountable.
 */
export function validateServerEntry(entry: McpServerEntry): string[] {
  const problems: string[] = []
  if (!SERVER_NAME_PATTERN.test(entry.name)) {
    problems.push('name must match [A-Za-z0-9_-]{1,32}')
  }
  if (entry.transport === 'stdio') {
    if (entry.command.trim().length === 0) problems.push('a stdio server requires a command')
  } else {
    if (entry.url.trim().length === 0) {
      problems.push('a streamable-http server requires a url')
    } else if (!isHttpUrl(entry.url)) {
      problems.push('url must be an absolute http(s) URL')
    }
  }
  return problems
}

/** Whether one string parses as an absolute HTTP(S) URL. */
function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Project one registry entry onto the config one `dsh-mcp-client` instance
 * accepts.
 *
 * Live instances use `failOnStartupError: false` so a server that is down at
 * host startup keeps its reconnect supervisor instead of aborting the mount;
 * a failed first attempt is logged by the client and the manager reports the
 * server as not yet connected.
 * @param entry - a schema-valid registry entry.
 * @returns the child plugin's config, discriminated on the entry's transport.
 */
export function toClientConfig(entry: McpServerEntry): McpClient.Config {
  if (entry.transport === 'stdio') {
    return {
      transport: 'stdio',
      serverName: entry.name,
      command: entry.command,
      args: [...entry.args],
      env: { ...entry.env },
      cwd: entry.cwd,
      toolCallTimeoutMs: entry.toolCallTimeoutMs,
      failOnStartupError: false,
    }
  }
  return {
    transport: 'streamable-http',
    serverName: entry.name,
    url: entry.url,
    headers: { ...entry.headers },
    toolCallTimeoutMs: entry.toolCallTimeoutMs,
    failOnStartupError: false,
  }
}

/**
 * Stable identity of the config a live client was mounted with. Two entries
 * with the same signature produce the same connection and the same tool
 * definitions, so reconciliation keeps the existing fiber instead of
 * remounting; any difference remounts.
 * @param entry - the registry entry.
 * @returns a JSON string over the projected client config.
 */
export function mountSignature(entry: McpServerEntry): string {
  return JSON.stringify(toClientConfig(entry))
}

/** One reconciliation step set: which live clients to stop and which to start. */
export interface ReconcilePlan {
  /** Mounted server names whose entry was removed, disabled, or changed. */
  readonly stop: string[]
  /** Registry entries that need a (new) live client, in registry order. */
  readonly start: McpServerEntry[]
}

/**
 * Diff the configured registry against the live clients.
 *
 * Disabled, duplicated, or invalid entries never produce a client; a name that
 * appears twice keeps its last definition, matching "later row wins" for any
 * other configuration layer. The plan is pure so the mount loop stays a thin
 * effect and the naming/selection policy is unit-testable.
 * @param servers - the configured registry, in order.
 * @param mounted - live server name to the signature it was mounted with.
 * @returns the names to stop and the entries to start.
 */
export function planReconcile(
  servers: readonly McpServerEntry[],
  mounted: ReadonlyMap<string, string>,
): ReconcilePlan {
  const desired = new Map<string, McpServerEntry>()
  for (const entry of servers) {
    if (!entry.enabled) continue
    if (validateServerEntry(entry).length > 0) continue
    desired.set(entry.name, entry)
  }
  const stop: string[] = []
  for (const name of mounted.keys()) {
    if (!desired.has(name)) stop.push(name)
  }
  const start: McpServerEntry[] = []
  for (const [name, entry] of desired) {
    const signature = mountSignature(entry)
    if (mounted.get(name) === signature) continue
    if (mounted.has(name)) stop.push(name)
    start.push(entry)
  }
  return { stop, start }
}

/**
 * The public tool prefix one server owns.
 * @param serverName - the entry's `name` namespace.
 * @returns the `mcp__<serverName>__` prefix.
 */
export function toolPrefix(serverName: string): string {
  return `mcp__${serverName}__`
}

/**
 * One-line description of where a server connects, for status output and the
 * browser card.
 * @param entry - the registry entry.
 * @returns a command line for stdio, or the URL for streamable-http.
 */
export function describeTarget(entry: McpServerEntry): string {
  return entry.transport === 'stdio'
    ? [entry.command, ...entry.args].filter(part => part.length > 0).join(' ')
    : entry.url
}
