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
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { SettingsScope } from '@deepseek-ai/dsh-client-ui-settings/client';
import type { McpManagerKey } from './locales.ts';
/** Settings namespace the card edits; the Host registers the same value. */
export declare const MCP_MANAGER_NS = "mcp-manager";
/** Servers shown per page; the list pages instead of growing without bound. */
export declare const MCP_MANAGER_PAGE_SIZE = 5;
/** Transports the Host manager accepts. */
export type McpTransport = 'stdio' | 'streamable-http';
/** One server as stored in the settings section. */
export interface StoredServer {
    /** Stable namespace for the server's public tool names. */
    name: string;
    /** Selected transport. */
    transport: McpTransport;
    /** Whether the Host keeps a live client mounted. */
    enabled?: boolean;
    /** stdio: executable. */
    command?: string;
    /** stdio: arguments. */
    args?: string[];
    /** stdio: extra environment variables. */
    env?: Record<string, string>;
    /** stdio: working directory. */
    cwd?: string;
    /** streamable-http: endpoint URL. */
    url?: string;
    /** streamable-http: extra request headers. */
    headers?: Record<string, string>;
    /** Per-tool-call timeout in milliseconds. */
    toolCallTimeoutMs?: number;
}
/** The settings section value. */
export interface McpManagerSettings {
    /** Configured servers. */
    servers?: StoredServer[];
}
/** A server as the card lists it. */
export interface ServerView {
    /** The server namespace. */
    readonly name: string;
    /** Selected transport. */
    readonly transport: McpTransport;
    /** Whether the Host keeps it mounted. */
    readonly enabled: boolean;
    /** Command line or endpoint the server connects to. */
    readonly target: string;
}
/** The add form's draft text, one string per control. */
export interface DraftState {
    /** Server namespace. */
    name: string;
    /** Selected transport. */
    transport: McpTransport;
    /** stdio: executable. */
    command: string;
    /** stdio: one argument per line. */
    args: string;
    /** stdio: one `NAME=value` per line. */
    env: string;
    /** stdio: working directory. */
    cwd: string;
    /** streamable-http: endpoint URL. */
    url: string;
    /** streamable-http: one `Name: value` per line. */
    headers: string;
    /** Per-call timeout draft text. */
    toolCallTimeoutMs: string;
}
/** The card's full render state. */
export interface McpManagerCardState {
    /** False while the Host does not serve the namespace; the card renders nothing. */
    available: boolean;
    /** Whether the Host document accepts writes. */
    writable: boolean;
    /** Whether a write is crossing the wire. */
    saving: boolean;
    /** Latest refusal, as a locale key; null when the last action succeeded. */
    error: McpManagerKey | null;
    /** Configured servers, in document order. */
    servers: readonly ServerView[];
    /** Current filter text; empty shows every server. */
    query: string;
    /** How many servers match the current filter. */
    matched: number;
    /** Zero-based index of the visible page, clamped to `pageCount`. */
    page: number;
    /** Number of pages the filtered list spans; always at least 1. */
    pageCount: number;
    /** The current page's slice of the filtered servers. */
    visible: readonly ServerView[];
    /** Whether the add dialog is showing. */
    addOpen: boolean;
    /** The add form's drafts. */
    draft: DraftState;
}
/** Editable draft fields, excluding the transport select. */
export type DraftField = Exclude<keyof DraftState, 'transport'>;
/** The registration-side face the card's slot entry injects. */
export interface McpManagerCardFace {
    /** Card snapshot bound by the renderer as useMcpManagerCard. */
    hooks: {
        mcpManagerCard: SnapshotStore<McpManagerCardState>;
    };
    /** Replace the filter text; the list jumps back to the first page. */
    setQuery(query: string): void;
    /** Show one page of the filtered list; out-of-range values clamp. */
    setPage(page: number): void;
    /** Open the add dialog. */
    openAdd(): void;
    /** Close the add dialog, discarding the staged draft. */
    closeAdd(): void;
    /** Stage draft text for one field. */
    edit(field: DraftField, text: string): void;
    /** Select the transport, which switches which fields the form shows. */
    setTransport(transport: McpTransport): void;
    /** Validate and write the staged server, then clear the form on success. */
    add(): void;
    /** Remove one configured server. */
    remove(name: string): void;
    /** Enable or disable one configured server. */
    setEnabled(name: string, enabled: boolean): void;
    /** Clear the add form. */
    resetDraft(): void;
}
/** Bridges the `mcp-manager` settings scope onto the card's snapshot. */
export declare class McpManagerCardController {
    private readonly scope;
    private readonly store;
    private readonly unsubscribe;
    /** @param scope - the bound settings scope for the `mcp-manager` namespace. */
    constructor(scope: SettingsScope<McpManagerSettings>);
    /** Release the scope subscription. */
    dispose(): void;
    /**
     * Build the face the card's slot registration injects.
     * @returns the card's snapshot store and its gesture actions.
     */
    inject(): McpManagerCardFace;
    /** Copy the resolved scope value onto the card state. */
    private project;
    /** The currently stored servers. */
    private current;
    /** The stored servers without one name. */
    private without;
    /** Validate and write the staged server. */
    private add;
    /**
     * Persist one server list.
     * @param next - the complete next list for the namespace's `servers` field.
     * @returns whether the Host accepted the write.
     */
    private write;
}
//# sourceMappingURL=card-controller.d.ts.map