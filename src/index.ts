/**
 * MCP manager plugin: one place to add, remove, enable, and disable external
 * Model Context Protocol servers, and the mount loop that makes their tools
 * callable as native harness tools.
 *
 * The plugin keeps a declarative registry of servers. The registry is stored in
 * the `mcp-manager` user-settings section when a settings provider is composed
 * (the Web profile mounts one), so the browser card and the model tools edit
 * the same document. Reconciliation diffs that registry against live child
 * `dsh-mcp-client` instances: a new or changed entry mounts a child fiber, a
 * removed or disabled entry disposes one, and an unchanged entry keeps its
 * connection and its stable `mcp__<name>__` tool names.
 *
 * Named exports (no default export) so the Loader reads `name`, `inject`, and
 * `Config` for injection and validation.
 *
 * @module @ctl456/dsh-mcp-manager
 */

import type { Context } from '@deepseek-ai/cordis'
import type { Fiber } from '@deepseek-ai/cordis'
import * as McpClient from '@deepseek-ai/dsh-mcp-client'
import type { SettingsProvider } from '@deepseek-ai/dsh-settings'
// Type-only: resolves the `ctx.tools` Context augmentation.
import type {} from '@deepseek-ai/dsh-tools'
import {
  Config,
  describeTarget,
  mountSignature,
  planReconcile,
  toClientConfig,
  toolPrefix,
  validateServerEntry,
  type McpServerEntry,
} from './servers.ts'
import { managerTools, type ManagerPort, type ServerStatus } from './tools.ts'

/** Cordis plugin name used by loader diagnostics. */
export const name = 'mcp-manager'

/** Services required before the plugin activates. */
export const inject = ['tools']

/** Schemastery schema for the composition entry and the settings section. */
export { Config }

/** Registry value shape re-exported for tools, tests, and downstream consumers. */
export type { McpServerEntry }

/** Settings namespace owning the server registry; the card keys on the same value. */
export const SETTINGS_NS = 'mcp-manager'

/** One live child client the manager keeps mounted. */
interface MountedServer {
  /** Signature of the entry the child was mounted with. */
  readonly signature: string
  /** Dispose the child fiber and wait for its connection teardown. */
  readonly dispose: () => Promise<void> | void
}

/**
 * Register the manager: install the registry section, mount the current
 * servers, expose the management tools, and reconcile on every settings change.
 * @param ctx - the host context the manager is mounted on.
 * @param config - the composition entry's registry, used as the settings base layer.
 */
export function apply(ctx: Context, config: Config): void {
  const mounted = new Map<string, MountedServer>()
  let currentServers: McpServerEntry[] = [...config.servers]
  let readSource: () => Config = () => ({ servers: currentServers })
  let settings: SettingsProvider | undefined
  let queue: Promise<void> = Promise.resolve()

  const statusOf = (entry: McpServerEntry): ServerStatus => {
    const prefix = toolPrefix(entry.name)
    const tools = ctx.tools.schemas()
      .map(schema => schema.name)
      .filter(schemaName => schemaName.startsWith(prefix))
      .map(schemaName => schemaName.slice(prefix.length))
    return {
      name: entry.name,
      transport: entry.transport,
      enabled: entry.enabled,
      connected: mounted.has(entry.name) && tools.length > 0,
      target: describeTarget(entry),
      tools,
      problems: validateServerEntry(entry),
    }
  }

  const list = (): readonly ServerStatus[] => readSource().servers.map(statusOf)

  const unmount = async (serverName: string): Promise<void> => {
    const live = mounted.get(serverName)
    mounted.delete(serverName)
    /* v8 ignore next -- reconcile only ever stops names it read from `mounted`, so the lookup always hits */
    if (live === undefined) return
    try {
      await live.dispose()
    } catch (error: unknown) {
      /* v8 ignore next -- cordis contains an effect-disposer throw, so fiber.dispose() does not reject */
      ctx.logger.warn(`mcp-manager: disposing server "${serverName}" failed: ${String(error)}`)
    }
  }

  const reconcile = async (): Promise<void> => {
    const plan = planReconcile(currentServers, new Map([...mounted].map(([serverName, live]) => [serverName, live.signature])))
    for (const serverName of plan.stop) await unmount(serverName)
    for (const entry of plan.start) {
      let fiber: Fiber
      try {
        fiber = ctx.plugin(McpClient, toClientConfig(entry))
        await fiber.await()
      } catch (error: unknown) {
        // A configuration the client rejects (an unparseable URL, a bad env
        // entry) must not abort the whole reconciliation; the entry stays
        // configured, and the next change retries it.
        ctx.logger.error(`mcp-manager: mounting server "${entry.name}" failed: ${String(error)}`)
        continue
      }
      mounted.set(entry.name, { signature: mountSignature(entry), dispose: () => fiber.dispose() })
    }
  }

  const schedule = (): void => {
    /* v8 ignore next -- reconcile contains every per-server failure, so only a defect can reject the queue */
    queue = queue.then(reconcile).catch((error: unknown) => {
      ctx.logger.error(`mcp-manager: reconciliation failed: ${String(error)}`)
    })
  }

  const persist = async (next: McpServerEntry[]): Promise<void> => {
    const previous = currentServers
    currentServers = next
    if (settings === undefined) {
      schedule()
      return
    }
    try {
      await settings.update(SETTINGS_NS, { servers: next })
    } catch (error: unknown) {
      // A refused write leaves the document unchanged, so the cached list must
      // not keep the optimistic value the caller saw rejected.
      currentServers = previous
      throw error
    }
  }

  const upsert = async (entry: McpServerEntry): Promise<void> => {
    const problems = validateServerEntry(entry)
    if (problems.length > 0) throw new Error(`invalid MCP server "${entry.name}": ${problems.join('; ')}`)
    const next = currentServers.filter(candidate => candidate.name !== entry.name)
    next.push(entry)
    await persist(next)
  }

  const remove = async (serverName: string): Promise<void> => {
    const next = currentServers.filter(candidate => candidate.name !== serverName)
    if (next.length === currentServers.length) return
    await persist(next)
  }

  const setEnabled = async (serverName: string, enabled: boolean): Promise<void> => {
    const next = currentServers.map(candidate => candidate.name === serverName ? { ...candidate, enabled } : candidate)
    if (next.every((candidate, index) => candidate.enabled === currentServers[index]?.enabled)) return
    await persist(next)
  }

  const port: ManagerPort = { list, upsert, remove, setEnabled }
  for (const tool of managerTools(port)) ctx.tools.register(tool)

  // The settings section is optional: a deployment without a provider keeps
  // running on the composition entry, and the card reports itself unavailable.
  ctx.inject(['settings'], (settingsCtx) => {
    settings = settingsCtx.settings
    settingsCtx.settings.installSection(ctx, SETTINGS_NS, Config, config, {
      setSource: (current) => {
        readSource = current
        currentServers = current().servers
      },
      onChange: () => {
        currentServers = readSource().servers
        schedule()
      },
    })
    ctx.effect(() => () => {
      settings = undefined
    }, 'mcp-manager.settings-source')
  })

  schedule()
}
