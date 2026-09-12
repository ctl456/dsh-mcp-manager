window.__ModuleLoader__.load({
	id: "@ctl456/dsh-mcp-manager",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		//#region \0dsh-css:/home/ctl456/Code_Project/deepseek-harness/packages/mcp/mcp-manager/src/client/McpManagerCard.module.css.mjs
		const css = ".Q8bH4q_page{flex-direction:column;gap:14px;display:flex}.Q8bH4q_header{flex-direction:column;gap:2px;display:flex}.Q8bH4q_title{margin:0;font-size:16px;font-weight:600}.Q8bH4q_description{color:var(--dsw-alias-label-secondary);font-size:12px}.Q8bH4q_notice{color:var(--dsw-alias-label-secondary);margin:0;font-size:12px}.Q8bH4q_toolbar{align-items:center;gap:8px;display:flex}.Q8bH4q_searchWrap{flex:1;align-items:center;min-width:0;display:flex;position:relative}.Q8bH4q_searchIcon{color:var(--dsw-alias-label-secondary);pointer-events:none;display:inline-flex;position:absolute;left:9px}.Q8bH4q_search{box-sizing:border-box;width:100%;font:inherit;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:inherit;border-radius:6px;padding:6px 8px 6px 30px;font-size:13px}.Q8bH4q_list{flex-direction:column;gap:8px;margin:0;padding:0;list-style:none;display:flex}.Q8bH4q_server{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;justify-content:space-between;align-items:center;gap:12px;padding:8px 10px;display:flex}.Q8bH4q_serverText{flex-direction:column;min-width:0;display:flex}.Q8bH4q_serverName{font-size:13px;font-weight:600}.Q8bH4q_serverTarget{color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;font-size:12px;overflow:hidden}.Q8bH4q_serverActions{flex-shrink:0;align-items:center;gap:6px;display:flex}.Q8bH4q_badgeOn,.Q8bH4q_badgeOff{border:1px solid;border-radius:999px;padding:1px 8px;font-size:11px}.Q8bH4q_badgeOn{color:var(--dsw-alias-state-success-primary)}.Q8bH4q_badgeOff{color:var(--dsw-alias-label-secondary)}.Q8bH4q_empty{color:var(--dsw-alias-label-secondary);margin:0;font-size:12px}.Q8bH4q_pager{justify-content:flex-end;align-items:center;gap:8px;display:flex}.Q8bH4q_pageInfo{color:var(--dsw-alias-label-secondary);font-size:12px}.Q8bH4q_dialogContent{max-height:68vh;overflow-y:auto}.Q8bH4q_field{flex-direction:column;gap:4px;display:flex}.Q8bH4q_label{font-size:12px;font-weight:600}.Q8bH4q_input,.Q8bH4q_textarea{box-sizing:border-box;width:100%;font:inherit;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:inherit;resize:vertical;border-radius:6px;padding:6px 8px;font-size:13px}.Q8bH4q_hint{color:var(--dsw-alias-label-secondary);white-space:pre-line;font-size:11px}.Q8bH4q_error{color:var(--dsw-alias-state-error-primary);margin:0;font-size:12px}.Q8bH4q_actions{gap:8px;display:flex}.Q8bH4q_button,.Q8bH4q_primary,.Q8bH4q_danger{font:inherit;border:1px solid var(--dsw-alias-border-l1);color:inherit;cursor:pointer;background:0 0;border-radius:6px;align-items:center;gap:4px;padding:5px 12px;font-size:12px;display:inline-flex}.Q8bH4q_primary{background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground);border-color:#0000}.Q8bH4q_primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}.Q8bH4q_danger{color:var(--dsw-alias-state-error-primary)}.Q8bH4q_button:disabled,.Q8bH4q_primary:disabled,.Q8bH4q_danger:disabled{opacity:.5;cursor:not-allowed}";
		const tagId = "@ctl456/dsh-mcp-manager/McpManagerCard.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@ctl456/dsh-mcp-manager";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var McpManagerCard_module_css_default = {
			"actions": "Q8bH4q_actions",
			"badgeOff": "Q8bH4q_badgeOff",
			"badgeOn": "Q8bH4q_badgeOn",
			"button": "Q8bH4q_button",
			"danger": "Q8bH4q_danger",
			"description": "Q8bH4q_description",
			"dialogContent": "Q8bH4q_dialogContent",
			"empty": "Q8bH4q_empty",
			"error": "Q8bH4q_error",
			"field": "Q8bH4q_field",
			"header": "Q8bH4q_header",
			"hint": "Q8bH4q_hint",
			"input": "Q8bH4q_input",
			"label": "Q8bH4q_label",
			"list": "Q8bH4q_list",
			"notice": "Q8bH4q_notice",
			"page": "Q8bH4q_page",
			"pageInfo": "Q8bH4q_pageInfo",
			"pager": "Q8bH4q_pager",
			"primary": "Q8bH4q_primary",
			"search": "Q8bH4q_search",
			"searchIcon": "Q8bH4q_searchIcon",
			"searchWrap": "Q8bH4q_searchWrap",
			"server": "Q8bH4q_server",
			"serverActions": "Q8bH4q_serverActions",
			"serverName": "Q8bH4q_serverName",
			"serverTarget": "Q8bH4q_serverTarget",
			"serverText": "Q8bH4q_serverText",
			"textarea": "Q8bH4q_textarea",
			"title": "Q8bH4q_title",
			"toolbar": "Q8bH4q_toolbar"
		};
		//#endregion
		//#region src/client/McpManagerCard.tsx
		/** One single-line text control. */
		function TextField(props) {
			const change = (event) => {
				props.onChange(event.target.value);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				className: McpManagerCard_module_css_default.field,
				htmlFor: props.id,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: McpManagerCard_module_css_default.label,
						children: props.label
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						id: props.id,
						className: McpManagerCard_module_css_default.input,
						type: "text",
						value: props.value,
						disabled: props.disabled,
						onChange: change
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: McpManagerCard_module_css_default.hint,
						children: props.hint
					})
				]
			});
		}
		/** One multi-line text control. */
		function AreaField(props) {
			const change = (event) => {
				props.onChange(event.target.value);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				className: McpManagerCard_module_css_default.field,
				htmlFor: props.id,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: McpManagerCard_module_css_default.label,
						children: props.label
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
						id: props.id,
						className: McpManagerCard_module_css_default.textarea,
						rows: 3,
						value: props.value,
						disabled: props.disabled,
						onChange: change
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: McpManagerCard_module_css_default.hint,
						children: props.hint
					})
				]
			});
		}
		/**
		* Render the MCP servers settings section.
		* @param props - locale copy, the section snapshot, and its actions.
		* @returns the section, or nothing while the Host does not serve the namespace.
		*/
		function McpManagerCard(props) {
			const { t } = props;
			const state = props.useMcpManagerCard((snapshot) => snapshot);
			if (!state.available) return null;
			const disabled = !state.writable || state.saving;
			const { draft } = state;
			const edit = (field) => (text) => {
				props.edit(field, text);
			};
			const emptyText = state.servers.length === 0 ? t("empty") : t("noMatch");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: McpManagerCard_module_css_default.page,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: McpManagerCard_module_css_default.header,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							className: McpManagerCard_module_css_default.title,
							children: t("title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: McpManagerCard_module_css_default.description,
							children: t("description")
						})]
					}),
					!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: McpManagerCard_module_css_default.notice,
						role: "status",
						children: t("readOnly")
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: McpManagerCard_module_css_default.toolbar,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: McpManagerCard_module_css_default.searchWrap,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {
								className: McpManagerCard_module_css_default.searchIcon,
								size: 14
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								id: "mcp-manager-search",
								className: McpManagerCard_module_css_default.search,
								type: "search",
								value: state.query,
								placeholder: t("searchPlaceholder"),
								"aria-label": t("search"),
								onChange: (event) => {
									props.setQuery(event.target.value);
								}
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: McpManagerCard_module_css_default.primary,
							disabled,
							onClick: () => {
								props.openAdd();
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, { size: 14 }), t("addServer")]
						})]
					}),
					state.visible.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: McpManagerCard_module_css_default.empty,
						children: emptyText
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: McpManagerCard_module_css_default.list,
						children: state.visible.map((server) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
							className: McpManagerCard_module_css_default.server,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: McpManagerCard_module_css_default.serverText,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: McpManagerCard_module_css_default.serverName,
									children: server.name
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: McpManagerCard_module_css_default.serverTarget,
									children: [
										server.transport === "stdio" ? t("transportStdio") : t("transportHttp"),
										" · ",
										server.target
									]
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: McpManagerCard_module_css_default.serverActions,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: server.enabled ? McpManagerCard_module_css_default.badgeOn : McpManagerCard_module_css_default.badgeOff,
										children: server.enabled ? t("enabled") : t("disabled")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: McpManagerCard_module_css_default.button,
										disabled,
										onClick: () => {
											props.setEnabled(server.name, !server.enabled);
										},
										children: server.enabled ? t("disable") : t("enable")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: McpManagerCard_module_css_default.danger,
										disabled,
										onClick: () => {
											props.remove(server.name);
										},
										children: t("remove")
									})
								]
							})]
						}, server.name))
					}),
					state.pageCount > 1 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: McpManagerCard_module_css_default.pager,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: McpManagerCard_module_css_default.button,
								"aria-label": t("prevPage"),
								disabled: state.page === 0,
								onClick: () => {
									props.setPage(state.page - 1);
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutline14, { size: 14 })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: McpManagerCard_module_css_default.pageInfo,
								children: t("pageInfo", {
									page: state.page + 1,
									pages: state.pageCount
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: McpManagerCard_module_css_default.button,
								"aria-label": t("nextPage"),
								disabled: state.page >= state.pageCount - 1,
								onClick: () => {
									props.setPage(state.page + 1);
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutline14, { size: 14 })
							})
						]
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: state.addOpen,
						onClose: () => {
							props.closeAdd();
						},
						title: t("addTitle"),
						closeLabel: t("close"),
						contentClassName: McpManagerCard_module_css_default.dialogContent,
						footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: McpManagerCard_module_css_default.button,
							disabled: state.saving,
							onClick: () => {
								props.closeAdd();
							},
							children: t("cancel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: McpManagerCard_module_css_default.primary,
							disabled,
							onClick: () => {
								props.add();
							},
							children: t("add")
						})] }),
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TextField, {
								id: "mcp-manager-name",
								label: t("name"),
								hint: t("nameHint"),
								value: draft.name,
								disabled,
								onChange: edit("name")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: McpManagerCard_module_css_default.field,
								htmlFor: "mcp-manager-transport",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: McpManagerCard_module_css_default.label,
										children: t("transport")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
										id: "mcp-manager-transport",
										className: McpManagerCard_module_css_default.input,
										value: draft.transport,
										disabled,
										onChange: (event) => {
											props.setTransport(event.target.value);
										},
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "stdio",
											children: t("transportStdio")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "streamable-http",
											children: t("transportHttp")
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: McpManagerCard_module_css_default.hint,
										children: t("transportHint")
									})
								]
							}),
							draft.transport === "stdio" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TextField, {
									id: "mcp-manager-command",
									label: t("command"),
									hint: t("commandHint"),
									value: draft.command,
									disabled,
									onChange: edit("command")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AreaField, {
									id: "mcp-manager-args",
									label: t("args"),
									hint: t("argsHint"),
									value: draft.args,
									disabled,
									onChange: edit("args")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AreaField, {
									id: "mcp-manager-env",
									label: t("env"),
									hint: t("envHint"),
									value: draft.env,
									disabled,
									onChange: edit("env")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TextField, {
									id: "mcp-manager-cwd",
									label: t("cwd"),
									hint: t("cwdHint"),
									value: draft.cwd,
									disabled,
									onChange: edit("cwd")
								})
							] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TextField, {
								id: "mcp-manager-url",
								label: t("url"),
								hint: t("urlHint"),
								value: draft.url,
								disabled,
								onChange: edit("url")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AreaField, {
								id: "mcp-manager-headers",
								label: t("headers"),
								hint: t("headersHint"),
								value: draft.headers,
								disabled,
								onChange: edit("headers")
							})] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TextField, {
								id: "mcp-manager-timeout",
								label: t("timeout"),
								hint: t("timeoutHint"),
								value: draft.toolCallTimeoutMs,
								disabled,
								onChange: edit("toolCallTimeoutMs")
							}),
							state.error !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: McpManagerCard_module_css_default.error,
								role: "status",
								children: t(state.error)
							}) : null,
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: McpManagerCard_module_css_default.actions,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: McpManagerCard_module_css_default.button,
									disabled,
									onClick: () => {
										props.resetDraft();
									},
									children: t("discard")
								})
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region src/client/card-controller.ts
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
		/** Settings namespace the card edits; the Host registers the same value. */
		const MCP_MANAGER_NS = "mcp-manager";
		/** The empty add form. */
		function emptyDraft() {
			return {
				name: "",
				transport: "stdio",
				command: "",
				args: "",
				env: "",
				cwd: "",
				url: "",
				headers: "",
				toolCallTimeoutMs: ""
			};
		}
		/** Split a textarea draft into trimmed, non-empty lines. */
		function lines(text) {
			return text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
		}
		/** Parse `NAME=value` lines into a record, rejecting a line without `=`. */
		function parseEnvironment(text) {
			const record = {};
			for (const line of lines(text)) {
				const at = line.indexOf("=");
				if (at <= 0) return void 0;
				record[line.slice(0, at)] = line.slice(at + 1);
			}
			return record;
		}
		/** Parse `Name: value` lines into a record, rejecting a line without `:`. */
		function parseHeaders(text) {
			const record = {};
			for (const line of lines(text)) {
				const at = line.indexOf(":");
				if (at <= 0) return void 0;
				record[line.slice(0, at).trim()] = line.slice(at + 1).trim();
			}
			return record;
		}
		/** The one-line connection target shown in the server list. */
		function targetOf(server) {
			return server.transport === "stdio" ? [server.command ?? "", ...server.args ?? []].filter((part) => part.length > 0).join(" ") : server.url ?? "";
		}
		/** The servers matching a filter over both the name and the connection target. */
		function filterServers(servers, query) {
			const needle = query.trim().toLowerCase();
			if (needle.length === 0) return [...servers];
			return servers.filter((server) => server.name.toLowerCase().includes(needle) || server.target.toLowerCase().includes(needle));
		}
		/**
		* Re-derive the paginated view from the current servers, filter, and page.
		* Clamping here as well as in {@link McpManagerCardFace.setPage} keeps the
		* page valid when a filter change or a pushed update shrinks the list.
		* @param state - the card state to update in place.
		*/
		function applyFilter(state) {
			const filtered = filterServers(state.servers, state.query);
			const pageCount = Math.max(1, Math.ceil(filtered.length / 5));
			const page = Math.min(Math.max(state.page, 0), pageCount - 1);
			const start = page * 5;
			state.matched = filtered.length;
			state.pageCount = pageCount;
			state.page = page;
			state.visible = filtered.slice(start, start + 5);
		}
		/** Whether a draft name is a valid server namespace. */
		function validName(name) {
			return /^[A-Za-z0-9_-]{1,32}$/.test(name);
		}
		/**
		* Build the add form's server entry, or the locale key of the first problem.
		* @param draft - the staged form.
		* @returns the entry to write, or the refusal's locale key.
		*/
		function draftToServer(draft) {
			const name = draft.name.trim();
			if (!validName(name)) return { error: "errorName" };
			const enabled = true;
			if (draft.transport === "stdio") {
				if (draft.command.trim().length === 0) return { error: "errorCommand" };
				const env = parseEnvironment(draft.env);
				if (env === void 0) return { error: "errorEnv" };
				return { server: {
					name,
					transport: "stdio",
					enabled,
					command: draft.command.trim(),
					args: lines(draft.args),
					env,
					cwd: draft.cwd.trim()
				} };
			}
			const url = draft.url.trim();
			if (!/^https?:\/\/.+/.test(url)) return { error: "errorUrl" };
			const headers = parseHeaders(draft.headers);
			if (headers === void 0) return { error: "errorHeaders" };
			return { server: {
				name,
				transport: "streamable-http",
				enabled,
				url,
				headers
			} };
		}
		/** The timeout draft resolves to a positive integer, or a refusal. */
		function resolveTimeout(text) {
			const trimmed = text.trim();
			if (trimmed.length === 0) return { value: void 0 };
			const parsed = Number(trimmed);
			if (!Number.isInteger(parsed) || parsed <= 0) return { error: "errorTimeout" };
			return { value: parsed };
		}
		/** Bridges the `mcp-manager` settings scope onto the card's snapshot. */
		var McpManagerCardController = class {
			scope;
			store;
			unsubscribe;
			/** @param scope - the bound settings scope for the `mcp-manager` namespace. */
			constructor(scope) {
				this.scope = scope;
				this.store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({
					available: false,
					writable: false,
					saving: false,
					error: null,
					servers: [],
					query: "",
					matched: 0,
					page: 0,
					pageCount: 1,
					visible: [],
					addOpen: false,
					draft: emptyDraft()
				});
				this.unsubscribe = scope.subscribe(() => {
					this.project();
				});
				this.project();
			}
			/** Release the scope subscription. */
			dispose() {
				this.unsubscribe();
			}
			/**
			* Build the face the card's slot registration injects.
			* @returns the card's snapshot store and its gesture actions.
			*/
			inject() {
				return {
					hooks: { mcpManagerCard: this.store },
					setQuery: (query) => {
						this.store.update((state) => {
							state.query = query;
							state.page = 0;
							applyFilter(state);
						});
					},
					setPage: (page) => {
						this.store.update((state) => {
							state.page = page;
							applyFilter(state);
						});
					},
					openAdd: () => {
						this.store.update((state) => {
							state.addOpen = true;
							state.error = null;
						});
					},
					closeAdd: () => {
						this.store.update((state) => {
							state.addOpen = false;
							state.error = null;
							state.draft = emptyDraft();
						});
					},
					edit: (field, text) => {
						this.store.update((draft) => {
							draft.draft[field] = text;
						});
					},
					setTransport: (transport) => {
						this.store.update((draft) => {
							draft.draft.transport = transport;
						});
					},
					add: () => {
						this.add();
					},
					remove: (name) => {
						this.write(this.without(name));
					},
					setEnabled: (name, enabled) => {
						this.write(this.current().map((server) => server.name === name ? {
							...server,
							enabled
						} : server));
					},
					resetDraft: () => {
						this.store.update((draft) => {
							draft.draft = emptyDraft();
						});
					}
				};
			}
			/** Copy the resolved scope value onto the card state. */
			project() {
				const snapshot = this.scope.getSnapshot();
				const servers = (snapshot.value?.servers ?? []).map((server) => ({
					name: server.name,
					transport: server.transport,
					enabled: server.enabled !== false,
					target: targetOf(server)
				}));
				this.store.update((state) => {
					state.available = snapshot.status === "ready";
					state.writable = snapshot.writable;
					state.servers = servers;
					applyFilter(state);
				});
			}
			/** The currently stored servers. */
			current() {
				return [...this.scope.getSnapshot().value?.servers ?? []];
			}
			/** The stored servers without one name. */
			without(name) {
				return this.current().filter((server) => server.name !== name);
			}
			/** Validate and write the staged server. */
			async add() {
				if (!this.store.getSnapshot().available) return;
				const draft = this.store.getSnapshot().draft;
				const parsed = draftToServer(draft);
				if ("error" in parsed) {
					this.store.update((state) => {
						state.error = parsed.error;
					});
					return;
				}
				const timeout = resolveTimeout(draft.toolCallTimeoutMs);
				if ("error" in timeout) {
					this.store.update((state) => {
						state.error = timeout.error;
					});
					return;
				}
				if (timeout.value !== void 0) parsed.server.toolCallTimeoutMs = timeout.value;
				const entry = stripUndefined(parsed.server);
				const next = this.without(entry.name);
				next.push(entry);
				if (await this.write(next)) this.store.update((state) => {
					state.draft = emptyDraft();
					state.addOpen = false;
				});
			}
			/**
			* Persist one server list.
			* @param next - the complete next list for the namespace's `servers` field.
			* @returns whether the Host accepted the write.
			*/
			async write(next) {
				if (!this.store.getSnapshot().available) return false;
				if (!this.store.getSnapshot().writable) {
					this.store.update((state) => {
						state.error = "readOnly";
					});
					return false;
				}
				this.store.update((state) => {
					state.saving = true;
					state.error = null;
				});
				try {
					await this.scope.set("servers", next);
					this.store.update((state) => {
						state.saving = false;
					});
					return true;
				} catch {
					this.store.update((state) => {
						state.saving = false;
						state.error = "saveFailed";
					});
					return false;
				}
			}
		};
		/** Drop optional fields the form left unset. */
		function stripUndefined(server) {
			const entry = {};
			for (const [key, value] of Object.entries(server))
 /* v8 ignore next -- draftToServer only ever assigns defined fields */
			if (value !== void 0) entry[key] = value;
			return entry;
		}
		//#endregion
		//#region src/client/locales.ts
		/** `settings.mcp-manager` dictionary: the MCP server card's copy. */
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			title: "MCP 服务器",
			description: "连接外部 MCP 服务器，让模型像调用内置工具一样调用它们的工具",
			unavailable: "当前部署未启用 MCP 管理器",
			readOnly: "当前部署的设置为只读，无法在这里修改。",
			empty: "还没有配置任何 MCP 服务器。添加一个后，它的工具会立刻出现在对话中。",
			servers: "已配置的服务器",
			search: "搜索服务器",
			searchPlaceholder: "按名称或连接地址筛选",
			noMatch: "没有匹配的 MCP 服务器，换个关键字试试。",
			addServer: "添加服务器",
			addTitle: "添加 MCP 服务器",
			close: "关闭",
			cancel: "取消",
			prevPage: "上一页",
			nextPage: "下一页",
			pageInfo: "第 {page} / {pages} 页",
			name: "名称",
			nameHint: "英文字母、数字、下划线或连字符，1-32 个字符。模型会以 mcp__名称__工具名 调用。",
			transport: "连接方式",
			transportStdio: "本地程序（stdio）",
			transportHttp: "远程服务（HTTP）",
			transportHint: "本地命令用 stdio；在线 MCP 服务用 HTTP。",
			command: "命令",
			commandHint: "例如 npx、uvx 或某个可执行文件的路径。",
			args: "参数",
			argsHint: "每行一个参数，例如：\n-y\n@modelcontextprotocol/server-filesystem",
			env: "环境变量",
			envHint: "每行一个 NAME=值，例如 GITHUB_TOKEN=xxx。",
			cwd: "工作目录",
			cwdHint: "可选，留空则使用当前目录。",
			url: "服务地址",
			urlHint: "完整的 http:// 或 https:// 地址。",
			headers: "请求头",
			headersHint: "每行一个 名称: 值，例如 Authorization: Bearer xxx。",
			timeout: "单次调用超时（毫秒）",
			timeoutHint: "留空使用默认值 60000。",
			add: "添加",
			discard: "清空",
			remove: "删除",
			enable: "启用",
			disable: "停用",
			enabled: "已启用",
			disabled: "已停用",
			target: "连接目标",
			errorName: "名称必须是 1-32 个英文字母、数字、下划线或连字符。",
			errorDuplicate: "已存在同名服务器，添加会覆盖它。",
			errorCommand: "使用 stdio 时必须填写命令。",
			errorUrl: "使用 HTTP 时必须填写合法的 http(s) 地址。",
			errorEnv: "环境变量格式应为 每行 名称=值。",
			errorHeaders: "请求头格式应为 每行 名称: 值。",
			errorTimeout: "超时时间必须是正整数毫秒数。",
			saveFailed: "保存失败，请检查后重试。"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			title: "MCP servers",
			description: "Connect external MCP servers so the model can call their tools like native tools",
			unavailable: "This deployment does not compose the MCP manager.",
			readOnly: "This deployment stores settings read-only; they cannot be changed here.",
			empty: "No MCP server is configured yet. Add one and its tools appear in the conversation immediately.",
			servers: "Configured servers",
			search: "Search servers",
			searchPlaceholder: "Filter by name or connection target",
			noMatch: "No MCP server matches the filter; try another keyword.",
			addServer: "Add server",
			addTitle: "Add an MCP server",
			close: "Close",
			cancel: "Cancel",
			prevPage: "Previous page",
			nextPage: "Next page",
			pageInfo: "Page {page} of {pages}",
			name: "Name",
			nameHint: "Letters, digits, underscore, or hyphen, 1-32 characters. The model calls its tools as mcp__name__tool.",
			transport: "Connection",
			transportStdio: "Local program (stdio)",
			transportHttp: "Remote service (HTTP)",
			transportHint: "Use stdio for a local command and HTTP for an online MCP service.",
			command: "Command",
			commandHint: "For example npx, uvx, or the path to an executable.",
			args: "Arguments",
			argsHint: "One argument per line, for example:\n-y\n@modelcontextprotocol/server-filesystem",
			env: "Environment",
			envHint: "One NAME=value per line, for example GITHUB_TOKEN=xxx.",
			cwd: "Working directory",
			cwdHint: "Optional; empty inherits the host working directory.",
			url: "Endpoint URL",
			urlHint: "A complete http:// or https:// URL.",
			headers: "Headers",
			headersHint: "One Name: value per line, for example Authorization: Bearer xxx.",
			timeout: "Per-call timeout (ms)",
			timeoutHint: "Leave blank for the 60000 default.",
			add: "Add",
			discard: "Clear",
			remove: "Remove",
			enable: "Enable",
			disable: "Disable",
			enabled: "Enabled",
			disabled: "Disabled",
			target: "Target",
			errorName: "The name must be 1-32 letters, digits, underscores, or hyphens.",
			errorDuplicate: "A server with this name already exists; adding replaces it.",
			errorCommand: "A stdio server needs a command.",
			errorUrl: "A remote server needs a valid http(s) URL.",
			errorEnv: "Environment lines must read NAME=value.",
			errorHeaders: "Header lines must read Name: value.",
			errorTimeout: "The timeout must be a positive whole number of milliseconds.",
			saveFailed: "Saving failed; check the values and try again."
		};
		//#endregion
		//#region src/client/index.ts
		/** Locale namespace owning this card's copy. */
		const NS = "settings.mcp-manager";
		/** Required client services: the slot registry, locale, remote, and settings transport. */
		const inject = [
			"slots",
			"locale",
			"remote",
			"settingsScope"
		];
		/**
		* Register the MCP manager's browser surface.
		* @param ctx - the client plugin context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-mcp-manager: dictionaries");
			const controller = new McpManagerCardController(ctx.settingsScope.bind({ namespace: MCP_MANAGER_NS }));
			ctx.effect(() => () => {
				controller.dispose();
			}, "ui-mcp-manager: card controller");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: MCP_MANAGER_NS,
				order: 25,
				label: () => ctx.locale.bind(NS)("title"),
				locale: NS,
				inject: () => controller.inject()
			}, McpManagerCard));
		}
		//#endregion
		exports.MCP_MANAGER_NS = MCP_MANAGER_NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map