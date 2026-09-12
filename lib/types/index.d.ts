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
import type { Context } from '@deepseek-ai/cordis';
import { Config, type McpServerEntry } from './servers.ts';
/** Cordis plugin name used by loader diagnostics. */
export declare const name = "mcp-manager";
/** Services required before the plugin activates. */
export declare const inject: string[];
/** Schemastery schema for the composition entry and the settings section. */
export { Config };
/** Registry value shape re-exported for tools, tests, and downstream consumers. */
export type { McpServerEntry };
/** Settings namespace owning the server registry; the card keys on the same value. */
export declare const SETTINGS_NS = "mcp-manager";
/**
 * Register the manager: install the registry section, mount the current
 * servers, expose the management tools, and reconcile on every settings change.
 * @param ctx - the host context the manager is mounted on.
 * @param config - the composition entry's registry, used as the settings base layer.
 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map