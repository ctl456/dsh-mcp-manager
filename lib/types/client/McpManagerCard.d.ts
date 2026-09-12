/**
 * The MCP server card: list configured servers with enable/remove controls,
 * and one add form whose fields follow the selected transport. The card acts
 * on click and never stages a save; the Host is the only authority on whether
 * a write landed, and a refusal shows the localized reason in place.
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { McpManagerCardFace } from './card-controller.ts';
/** Props the renderer binds for the MCP server card. */
export type McpManagerCardProps = PropsRuntime<'settings.plugin.item'> & PropsLocale<'settings.mcp-manager'> & InjectFace<McpManagerCardFace>;
/**
 * Render the MCP server card.
 * @param props - locale copy, the card snapshot, and its actions.
 * @returns the card, or nothing while the Host does not serve the namespace.
 */
export declare function McpManagerCard(props: McpManagerCardProps): import("react").JSX.Element | null;
//# sourceMappingURL=McpManagerCard.d.ts.map