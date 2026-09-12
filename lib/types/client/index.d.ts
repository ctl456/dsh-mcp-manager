/**
 * Browser half of the MCP manager: register the card's dictionary and
 * contribute the MCP server card into the Plugins settings section under the
 * `mcp-manager` namespace key.
 *
 * The section dispatches one `settings.plugin.item` entry per namespace the
 * Host serves, so registering the key here is what pairs this card with the
 * Host's settings section; a deployment that never composes the manager shows
 * no card.
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