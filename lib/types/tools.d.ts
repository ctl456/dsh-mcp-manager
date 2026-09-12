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
import type { ToolDefinition } from '@deepseek-ai/dsh-tools';
import { type McpServerEntry, type McpTransport } from './servers.ts';
/** Live status of one configured server, as reported to the model and the card. */
export interface ServerStatus {
    /** The `serverName` namespace. */
    readonly name: string;
    /** Selected transport. */
    readonly transport: McpTransport;
    /** Whether reconciliation keeps a live client mounted. */
    readonly enabled: boolean;
    /** Whether the server currently registers at least one tool. */
    readonly connected: boolean;
    /** Where the server connects: a command line, or the endpoint URL. */
    readonly target: string;
    /** Raw MCP tool names currently bridged under `mcp__<name>__`. */
    readonly tools: readonly string[];
    /** Configuration problems that keep this entry from mounting; empty when mountable. */
    readonly problems: readonly string[];
}
/** The registry operations the tools and the card both drive. */
export interface ManagerPort {
    /** @returns the current status of every configured server, in registry order. */
    list(): readonly ServerStatus[];
    /** Add a server, or replace the entry with the same `name`. */
    upsert(entry: McpServerEntry): Promise<void>;
    /** Remove the server with this `name`; a missing name is a no-op. */
    remove(name: string): Promise<void>;
    /** Enable or disable one server without changing its other fields. */
    setEnabled(name: string, enabled: boolean): Promise<void>;
}
/**
 * Build the management tools for one registry port.
 * @param port - the live registry the tools read and mutate.
 * @returns registry-ready tool definitions, in a stable order.
 */
export declare function managerTools(port: ManagerPort): ToolDefinition[];
//# sourceMappingURL=tools.d.ts.map