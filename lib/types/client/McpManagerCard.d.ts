/**
 * The MCP servers settings section: one page listing the configured servers
 * with a filter box, a paged list, and enable/remove controls, plus one add
 * dialog whose fields follow the selected transport.
 *
 * The page acts on click and never stages a save; the Host is the only
 * authority on whether a write landed, and a refusal shows the localized
 * reason in place. Listing state (filter text, page, dialog visibility) lives
 * on the controller so it survives re-renders and a pushed update can clamp
 * the page it leaves behind.
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { McpManagerCardFace } from './card-controller.ts';
/** Props the renderer binds for the MCP servers settings section. */
export type McpManagerCardProps = PropsRuntime<'settings.section'> & PropsLocale<'settings.mcp-manager'> & InjectFace<McpManagerCardFace>;
/**
 * Render the MCP servers settings section.
 * @param props - locale copy, the section snapshot, and its actions.
 * @returns the section, or nothing while the Host does not serve the namespace.
 */
export declare function McpManagerCard(props: McpManagerCardProps): import("react").JSX.Element | null;
//# sourceMappingURL=McpManagerCard.d.ts.map