/**
 * The MCP server card: list configured servers with enable/remove controls,
 * and one add form whose fields follow the selected transport. The card acts
 * on click and never stages a save; the Host is the only authority on whether
 * a write landed, and a refusal shows the localized reason in place.
 */

import type { ChangeEvent } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: the settings.plugin.item slot declaration this card registers into.
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type { DraftField, McpManagerCardFace, McpTransport } from './card-controller.ts'
import css from './McpManagerCard.module.css'

/** Props the renderer binds for the MCP server card. */
export type McpManagerCardProps =
  PropsRuntime<'settings.plugin.item'>
  & PropsLocale<'settings.mcp-manager'>
  & InjectFace<McpManagerCardFace>

/** Shared shape of one labeled control. */
interface FieldProps {
  readonly id: string
  readonly label: string
  readonly hint: string
  readonly value: string
  readonly disabled: boolean
  readonly onChange: (text: string) => void
}

/** One single-line text control. */
function TextField(props: FieldProps) {
  const change = (event: ChangeEvent<HTMLInputElement>): void => { props.onChange(event.target.value) }
  return (
    <label className={css.field} htmlFor={props.id}>
      <span className={css.label}>{props.label}</span>
      <input id={props.id} className={css.input} type="text" value={props.value} disabled={props.disabled} onChange={change} />
      <span className={css.hint}>{props.hint}</span>
    </label>
  )
}

/** One multi-line text control. */
function AreaField(props: FieldProps) {
  const change = (event: ChangeEvent<HTMLTextAreaElement>): void => { props.onChange(event.target.value) }
  return (
    <label className={css.field} htmlFor={props.id}>
      <span className={css.label}>{props.label}</span>
      <textarea id={props.id} className={css.textarea} rows={3} value={props.value} disabled={props.disabled} onChange={change} />
      <span className={css.hint}>{props.hint}</span>
    </label>
  )
}

/**
 * Render the MCP server card.
 * @param props - locale copy, the card snapshot, and its actions.
 * @returns the card, or nothing while the Host does not serve the namespace.
 */
export function McpManagerCard(props: McpManagerCardProps) {
  const { t } = props
  const state = props.useMcpManagerCard(snapshot => snapshot)
  if (!state.available) return null
  const disabled = !state.writable || state.saving
  const { draft } = state
  const edit = (field: DraftField) => (text: string): void => { props.edit(field, text) }
  return (
    <li className={css.card}>
      <div className={css.header}>
        <span className={css.name}>{t('title')}</span>
        <span className={css.description}>{t('description')}</span>
      </div>
      <div className={css.body}>
        {!state.writable ? <p className={css.notice} role="status">{t('readOnly')}</p> : null}

        <section className={css.section}>
          <h4 className={css.sectionTitle}>{t('servers')}</h4>
          {state.servers.length === 0
            ? <p className={css.empty}>{t('empty')}</p>
            : (
              <ul className={css.list}>
                {state.servers.map(server => (
                  <li key={server.name} className={css.server}>
                    <span className={css.serverText}>
                      <span className={css.serverName}>{server.name}</span>
                      <span className={css.serverTarget}>
                        {server.transport === 'stdio' ? t('transportStdio') : t('transportHttp')}
                        {' · '}
                        {server.target}
                      </span>
                    </span>
                    <span className={css.serverActions}>
                      <span className={server.enabled ? css.badgeOn : css.badgeOff}>
                        {server.enabled ? t('enabled') : t('disabled')}
                      </span>
                      <button type="button" className={css.button} disabled={disabled} onClick={() => { props.setEnabled(server.name, !server.enabled) }}>
                        {server.enabled ? t('disable') : t('enable')}
                      </button>
                      <button type="button" className={css.danger} disabled={disabled} onClick={() => { props.remove(server.name) }}>
                        {t('remove')}
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
        </section>

        <section className={css.section}>
          <h4 className={css.sectionTitle}>{t('addTitle')}</h4>
          <TextField
            id="mcp-manager-name"
            label={t('name')}
            hint={t('nameHint')}
            value={draft.name}
            disabled={disabled}
            onChange={edit('name')}
          />
          <label className={css.field} htmlFor="mcp-manager-transport">
            <span className={css.label}>{t('transport')}</span>
            <select
              id="mcp-manager-transport"
              className={css.input}
              value={draft.transport}
              disabled={disabled}
              onChange={(event) => { props.setTransport(event.target.value as McpTransport) }}
            >
              <option value="stdio">{t('transportStdio')}</option>
              <option value="streamable-http">{t('transportHttp')}</option>
            </select>
            <span className={css.hint}>{t('transportHint')}</span>
          </label>
          {draft.transport === 'stdio'
            ? (
              <>
                <TextField id="mcp-manager-command" label={t('command')} hint={t('commandHint')} value={draft.command} disabled={disabled} onChange={edit('command')} />
                <AreaField id="mcp-manager-args" label={t('args')} hint={t('argsHint')} value={draft.args} disabled={disabled} onChange={edit('args')} />
                <AreaField id="mcp-manager-env" label={t('env')} hint={t('envHint')} value={draft.env} disabled={disabled} onChange={edit('env')} />
                <TextField id="mcp-manager-cwd" label={t('cwd')} hint={t('cwdHint')} value={draft.cwd} disabled={disabled} onChange={edit('cwd')} />
              </>
            )
            : (
              <>
                <TextField id="mcp-manager-url" label={t('url')} hint={t('urlHint')} value={draft.url} disabled={disabled} onChange={edit('url')} />
                <AreaField id="mcp-manager-headers" label={t('headers')} hint={t('headersHint')} value={draft.headers} disabled={disabled} onChange={edit('headers')} />
              </>
            )}
          <TextField id="mcp-manager-timeout" label={t('timeout')} hint={t('timeoutHint')} value={draft.toolCallTimeoutMs} disabled={disabled} onChange={edit('toolCallTimeoutMs')} />
          {state.error !== null ? <p className={css.error} role="status">{t(state.error)}</p> : null}
          <div className={css.actions}>
            <button type="button" className={css.primary} disabled={disabled} onClick={() => { props.add() }}>
              {t('add')}
            </button>
            <button type="button" className={css.button} disabled={disabled} onClick={() => { props.resetDraft() }}>
              {t('discard')}
            </button>
          </div>
        </section>
      </div>
    </li>
  )
}
