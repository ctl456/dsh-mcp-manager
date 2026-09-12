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

import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the ctx.settingsScope Context merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the SlotRegistry service merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
// Type-only: the settings.plugin.item slot declaration this card registers into.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
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

  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: MCP_MANAGER_NS,
    locale: NS,
    inject: () => controller.inject(),
  }, McpManagerCard))
}
