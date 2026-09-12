/**
 * The MCP server card's controller: bridge the `mcp-manager` settings scope
 * onto a small form model, and turn explicit user gestures (add, remove,
 * enable, disable) into revision-fenced settings writes.
 *
 * The card acts directly instead of staging a save: adding or removing a
 * server is a discrete gesture, and the settings scope already orders and
 * fences each write, so a separate save step would only risk leaving the card
 * out of sync with the document.
 *
 * @module @ctl456/dsh-mcp-manager/client/card-controller
 */

import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { SettingsScope } from '@deepseek-ai/dsh-client-ui-settings/client'
import type { McpManagerKey } from './locales.ts'

/** Settings namespace the card edits; the Host registers the same value. */
export const MCP_MANAGER_NS = 'mcp-manager'

/** Transports the Host manager accepts. */
export type McpTransport = 'stdio' | 'streamable-http'

/** One server as stored in the settings section. */
export interface StoredServer {
  /** Stable namespace for the server's public tool names. */
  name: string
  /** Selected transport. */
  transport: McpTransport
  /** Whether the Host keeps a live client mounted. */
  enabled?: boolean
  /** stdio: executable. */
  command?: string
  /** stdio: arguments. */
  args?: string[]
  /** stdio: extra environment variables. */
  env?: Record<string, string>
  /** stdio: working directory. */
  cwd?: string
  /** streamable-http: endpoint URL. */
  url?: string
  /** streamable-http: extra request headers. */
  headers?: Record<string, string>
  /** Per-tool-call timeout in milliseconds. */
  toolCallTimeoutMs?: number
}

/** The settings section value. */
export interface McpManagerSettings {
  /** Configured servers. */
  servers?: StoredServer[]
}

/** A server as the card lists it. */
export interface ServerView {
  /** The server namespace. */
  readonly name: string
  /** Selected transport. */
  readonly transport: McpTransport
  /** Whether the Host keeps it mounted. */
  readonly enabled: boolean
  /** Command line or endpoint the server connects to. */
  readonly target: string
}

/** The add form's draft text, one string per control. */
export interface DraftState {
  /** Server namespace. */
  name: string
  /** Selected transport. */
  transport: McpTransport
  /** stdio: executable. */
  command: string
  /** stdio: one argument per line. */
  args: string
  /** stdio: one `NAME=value` per line. */
  env: string
  /** stdio: working directory. */
  cwd: string
  /** streamable-http: endpoint URL. */
  url: string
  /** streamable-http: one `Name: value` per line. */
  headers: string
  /** Per-call timeout draft text. */
  toolCallTimeoutMs: string
}

/** The card's full render state. */
export interface McpManagerCardState {
  /** False while the Host does not serve the namespace; the card renders nothing. */
  available: boolean
  /** Whether the Host document accepts writes. */
  writable: boolean
  /** Whether a write is crossing the wire. */
  saving: boolean
  /** Latest refusal, as a locale key; null when the last action succeeded. */
  error: McpManagerKey | null
  /** Configured servers, in document order. */
  servers: readonly ServerView[]
  /** The add form's drafts. */
  draft: DraftState
}

/** Editable draft fields, excluding the transport select. */
export type DraftField = Exclude<keyof DraftState, 'transport'>

/** The registration-side face the card's slot entry injects. */
export interface McpManagerCardFace {
  /** Card snapshot bound by the renderer as useMcpManagerCard. */
  hooks: {
    mcpManagerCard: SnapshotStore<McpManagerCardState>
  }
  /** Stage draft text for one field. */
  edit(field: DraftField, text: string): void
  /** Select the transport, which switches which fields the form shows. */
  setTransport(transport: McpTransport): void
  /** Validate and write the staged server, then clear the form on success. */
  add(): void
  /** Remove one configured server. */
  remove(name: string): void
  /** Enable or disable one configured server. */
  setEnabled(name: string, enabled: boolean): void
  /** Clear the add form. */
  resetDraft(): void
}

/** The empty add form. */
function emptyDraft(): DraftState {
  return {
    name: '',
    transport: 'stdio',
    command: '',
    args: '',
    env: '',
    cwd: '',
    url: '',
    headers: '',
    toolCallTimeoutMs: '',
  }
}

/** Split a textarea draft into trimmed, non-empty lines. */
function lines(text: string): string[] {
  return text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
}

/** Parse `NAME=value` lines into a record, rejecting a line without `=`. */
function parseEnvironment(text: string): Record<string, string> | undefined {
  const record: Record<string, string> = {}
  for (const line of lines(text)) {
    const at = line.indexOf('=')
    if (at <= 0) return undefined
    record[line.slice(0, at)] = line.slice(at + 1)
  }
  return record
}

/** Parse `Name: value` lines into a record, rejecting a line without `:`. */
function parseHeaders(text: string): Record<string, string> | undefined {
  const record: Record<string, string> = {}
  for (const line of lines(text)) {
    const at = line.indexOf(':')
    if (at <= 0) return undefined
    record[line.slice(0, at).trim()] = line.slice(at + 1).trim()
  }
  return record
}

/** The one-line connection target shown in the server list. */
function targetOf(server: StoredServer): string {
  return server.transport === 'stdio'
    ? [server.command ?? '', ...(server.args ?? [])].filter(part => part.length > 0).join(' ')
    : (server.url ?? '')
}

/** Whether a draft name is a valid server namespace. */
function validName(name: string): boolean {
  return /^[A-Za-z0-9_-]{1,32}$/.test(name)
}

/**
 * Build the add form's server entry, or the locale key of the first problem.
 * @param draft - the staged form.
 * @returns the entry to write, or the refusal's locale key.
 */
function draftToServer(draft: DraftState): { server: StoredServer } | { error: McpManagerKey } {
  const name = draft.name.trim()
  if (!validName(name)) return { error: 'errorName' }
  const enabled = true
  if (draft.transport === 'stdio') {
    if (draft.command.trim().length === 0) return { error: 'errorCommand' }
    const env = parseEnvironment(draft.env)
    if (env === undefined) return { error: 'errorEnv' }
    return {
      server: {
        name,
        transport: 'stdio',
        enabled,
        command: draft.command.trim(),
        args: lines(draft.args),
        env,
        cwd: draft.cwd.trim(),
      },
    }
  }
  const url = draft.url.trim()
  if (!/^https?:\/\/.+/.test(url)) return { error: 'errorUrl' }
  const headers = parseHeaders(draft.headers)
  if (headers === undefined) return { error: 'errorHeaders' }
  return {
    server: {
      name,
      transport: 'streamable-http',
      enabled,
      url,
      headers,
    },
  }
}

/** The timeout draft resolves to a positive integer, or a refusal. */
function resolveTimeout(text: string): { value: number | undefined } | { error: McpManagerKey } {
  const trimmed = text.trim()
  if (trimmed.length === 0) return { value: undefined }
  const parsed = Number(trimmed)
  if (!Number.isInteger(parsed) || parsed <= 0) return { error: 'errorTimeout' }
  return { value: parsed }
}

/** Bridges the `mcp-manager` settings scope onto the card's snapshot. */
export class McpManagerCardController {
  private readonly store: SnapshotStore<McpManagerCardState>
  private readonly unsubscribe: () => void

  /** @param scope - the bound settings scope for the `mcp-manager` namespace. */
  constructor(private readonly scope: SettingsScope<McpManagerSettings>) {
    this.store = createSnapshotStore<McpManagerCardState>({
      available: false,
      writable: false,
      saving: false,
      error: null,
      servers: [],
      draft: emptyDraft(),
    })
    this.unsubscribe = scope.subscribe(() => { this.project() })
    this.project()
  }

  /** Release the scope subscription. */
  dispose(): void {
    this.unsubscribe()
  }

  /**
   * Build the face the card's slot registration injects.
   * @returns the card's snapshot store and its gesture actions.
   */
  inject(): McpManagerCardFace {
    return {
      hooks: { mcpManagerCard: this.store },
      edit: (field, text) => { this.store.update((draft) => { draft.draft[field] = text }) },
      setTransport: (transport) => { this.store.update((draft) => { draft.draft.transport = transport }) },
      add: () => { void this.add() },
      remove: (name) => { void this.write(this.without(name)) },
      setEnabled: (name, enabled) => {
        void this.write(this.current().map(server => server.name === name ? { ...server, enabled } : server))
      },
      resetDraft: () => { this.store.update((draft) => { draft.draft = emptyDraft() }) },
    }
  }

  /** Copy the resolved scope value onto the card state. */
  private project(): void {
    const snapshot = this.scope.getSnapshot()
    const value = snapshot.value
    const servers: ServerView[] = (value?.servers ?? []).map(server => ({
      name: server.name,
      transport: server.transport,
      enabled: server.enabled !== false,
      target: targetOf(server),
    }))
    this.store.update((draft) => {
      draft.available = snapshot.status === 'ready'
      draft.writable = snapshot.writable
      draft.servers = servers
    })
  }

  /** The currently stored servers. */
  private current(): StoredServer[] {
    return [...(this.scope.getSnapshot().value?.servers ?? [])]
  }

  /** The stored servers without one name. */
  private without(name: string): StoredServer[] {
    return this.current().filter(server => server.name !== name)
  }

  /** Validate and write the staged server. */
  private async add(): Promise<void> {
    if (!this.store.getSnapshot().available) return
    const draft = this.store.getSnapshot().draft
    const parsed = draftToServer(draft)
    if ('error' in parsed) {
      this.store.update((state) => { state.error = parsed.error })
      return
    }
    const timeout = resolveTimeout(draft.toolCallTimeoutMs)
    if ('error' in timeout) {
      this.store.update((state) => { state.error = timeout.error })
      return
    }
    if (timeout.value !== undefined) parsed.server.toolCallTimeoutMs = timeout.value
    // The stored document fills schema defaults, so drop undefined optional
    // fields rather than writing explicit nulls the Host schema would refuse.
    const entry = stripUndefined(parsed.server)
    const next = this.without(entry.name)
    next.push(entry)
    if (await this.write(next)) this.store.update((state) => { state.draft = emptyDraft() })
  }

  /**
   * Persist one server list.
   * @param next - the complete next list for the namespace's `servers` field.
   * @returns whether the Host accepted the write.
   */
  private async write(next: StoredServer[]): Promise<boolean> {
    if (!this.store.getSnapshot().available) return false
    if (!this.store.getSnapshot().writable) {
      this.store.update((state) => { state.error = 'readOnly' })
      return false
    }
    this.store.update((state) => { state.saving = true; state.error = null })
    try {
      await this.scope.set('servers', next)
      this.store.update((state) => { state.saving = false })
      return true
    } catch {
      this.store.update((state) => { state.saving = false; state.error = 'saveFailed' })
      return false
    }
  }
}

/** Drop optional fields the form left unset. */
function stripUndefined(server: StoredServer): StoredServer {
  const entry: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(server)) {
    /* v8 ignore next -- draftToServer only ever assigns defined fields */
    if (value !== undefined) entry[key] = value
  }
  return entry as unknown as StoredServer
}
