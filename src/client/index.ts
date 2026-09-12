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

import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the ctx.settingsScope Context merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the SlotRegistry service merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { McpManagerCard } from './McpManagerCard.tsx'
import { MCP_MANAGER_NS, McpManagerCardController, type McpManagerSettings } from './card-controller.ts'
import { en, zh } from './locales.ts'

/** Settings namespace the card edits, re-exported for consumers keying slot entries. */
export { MCP_MANAGER_NS }

/** Locale namespace owning this card's copy. */
const NS = 'settings.mcp-manager'

/** Required client services: the slot registry, locale, remote, and settings transport. */
export const inject = ['slots', 'locale', 'remote', 'settingsScope']

/**
 * Register the MCP manager's browser surface.
 * @param ctx - the client plugin context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-mcp-manager: dictionaries')

  const scope = ctx.settingsScope.bind<McpManagerSettings>({ namespace: MCP_MANAGER_NS })
  const controller = new McpManagerCardController(scope)
  ctx.effect(() => () => { controller.dispose() }, 'ui-mcp-manager: card controller')

  // Ordered after Agent presets (20), which is the last shipped section: the
  // MCP roster is an integration surface, not a preference, so it belongs at
  // the end of the nav until something newer claims a higher seat.
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: MCP_MANAGER_NS,
    order: 25,
    label: () => ctx.locale.bind(NS)('title'),
    locale: NS,
    inject: () => controller.inject(),
  }, McpManagerCard))
}
