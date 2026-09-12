/**
 * Browser half of the MCP manager: register the page's dictionary and
 * contribute the MCP servers page as its own `settings.section` entry.
 *
 * The section sits below Agent presets (order 25, after general/models/plugins/
 * agent-presets), so managing MCP servers is a first-class settings page rather
 * than a tab inside Plugins; a deployment that never composes the manager shows
 * no page.
 *
 * @module @ctl456/dsh-mcp-manager/client
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { MCP_MANAGER_NS } from './card-controller.ts';
/** Settings namespace the card edits, re-exported for consumers keying slot entries. */
export { MCP_MANAGER_NS };
/** Required client services: the slot registry, locale, remote, and settings transport. */
export declare const inject: string[];
/**
 * Register the MCP manager's browser surface.
 * @param ctx - the client plugin context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map