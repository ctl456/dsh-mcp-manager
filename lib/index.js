import * as McpClient from "@deepseek-ai/dsh-mcp-client";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
//#region lib/types/servers.js
/**
* Declarative MCP server registry: the persisted value shape, its Schemastery
* schema, cross-field validation, the projection into a `dsh-mcp-client`
* config, and the pure reconciliation plan the plugin applies to the live
* child clients.
*
* The registry is one module because every consumer — the settings section,
* the model tools, the browser card, and the mount/unmount loop — must agree
* on one value shape and one naming rule. `name` is the `serverName` namespace
* `dsh-mcp-client` uses, so the public tool prefix `mcp__<name>__` stays stable
* across reloads.
*
* @module @ctl456/dsh-mcp-manager/servers
*/
/** The valid `serverName` namespace, matching `dsh-mcp-client`'s own pattern. */
const SERVER_NAME_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;
/** Per-entry schema; fields default to the empty/zero value of their transport. */
const McpServerEntrySchema = z.object({
	name: z.string().required().pattern(SERVER_NAME_PATTERN),
	transport: z.union([z.const("stdio"), z.const("streamable-http")]).required(),
	enabled: z.boolean().default(true),
	command: z.string().default(""),
	args: z.array(String).default([]),
	env: z.dict(String).default({}),
	cwd: z.string().default(""),
	url: z.string().default(""),
	headers: z.dict(String).default({}),
	toolCallTimeoutMs: z.number().step(1).min(1).default(6e4)
});
/** Schemastery schema for {@link Config}; also the settings-section schema. */
const Config = z.object({ servers: z.array(McpServerEntrySchema).default([]) });
/**
* Check the constraints the per-entry schema cannot express.
*
* The schema sees each field alone; a stdio entry must carry a command, and a
* streamable-http entry must carry an absolute HTTP(S) URL. Returning every
* problem instead of the first lets an editor fix a form in one pass.
* @param entry - the resolved registry entry to check.
* @returns every problem found, in field order; empty when the entry is mountable.
*/
function validateServerEntry(entry) {
	const problems = [];
	if (!SERVER_NAME_PATTERN.test(entry.name)) problems.push("name must match [A-Za-z0-9_-]{1,32}");
	if (entry.transport === "stdio") {
		if (entry.command.trim().length === 0) problems.push("a stdio server requires a command");
	} else if (entry.url.trim().length === 0) problems.push("a streamable-http server requires a url");
	else if (!isHttpUrl(entry.url)) problems.push("url must be an absolute http(s) URL");
	return problems;
}
/** Whether one string parses as an absolute HTTP(S) URL. */
function isHttpUrl(value) {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}
/**
* Project one registry entry onto the config one `dsh-mcp-client` instance
* accepts.
*
* Live instances use `failOnStartupError: false` so a server that is down at
* host startup keeps its reconnect supervisor instead of aborting the mount;
* a failed first attempt is logged by the client and the manager reports the
* server as not yet connected.
* @param entry - a schema-valid registry entry.
* @returns the child plugin's config, discriminated on the entry's transport.
*/
function toClientConfig(entry) {
	if (entry.transport === "stdio") return {
		transport: "stdio",
		serverName: entry.name,
		command: entry.command,
		args: [...entry.args],
		env: { ...entry.env },
		cwd: entry.cwd,
		toolCallTimeoutMs: entry.toolCallTimeoutMs,
		failOnStartupError: false
	};
	return {
		transport: "streamable-http",
		serverName: entry.name,
		url: entry.url,
		headers: { ...entry.headers },
		toolCallTimeoutMs: entry.toolCallTimeoutMs,
		failOnStartupError: false
	};
}
/**
* Stable identity of the config a live client was mounted with. Two entries
* with the same signature produce the same connection and the same tool
* definitions, so reconciliation keeps the existing fiber instead of
* remounting; any difference remounts.
* @param entry - the registry entry.
* @returns a JSON string over the projected client config.
*/
function mountSignature(entry) {
	return JSON.stringify(toClientConfig(entry));
}
/**
* Diff the configured registry against the live clients.
*
* Disabled, duplicated, or invalid entries never produce a client; a name that
* appears twice keeps its last definition, matching "later row wins" for any
* other configuration layer. The plan is pure so the mount loop stays a thin
* effect and the naming/selection policy is unit-testable.
* @param servers - the configured registry, in order.
* @param mounted - live server name to the signature it was mounted with.
* @returns the names to stop and the entries to start.
*/
function planReconcile(servers, mounted) {
	const desired = /* @__PURE__ */ new Map();
	for (const entry of servers) {
		if (!entry.enabled) continue;
		if (validateServerEntry(entry).length > 0) continue;
		desired.set(entry.name, entry);
	}
	const stop = [];
	for (const name of mounted.keys()) if (!desired.has(name)) stop.push(name);
	const start = [];
	for (const [name, entry] of desired) {
		const signature = mountSignature(entry);
		if (mounted.get(name) === signature) continue;
		if (mounted.has(name)) stop.push(name);
		start.push(entry);
	}
	return {
		stop,
		start
	};
}
/**
* The public tool prefix one server owns.
* @param serverName - the entry's `name` namespace.
* @returns the `mcp__<serverName>__` prefix.
*/
function toolPrefix(serverName) {
	return `mcp__${serverName}__`;
}
/**
* One-line description of where a server connects, for status output and the
* browser card.
* @param entry - the registry entry.
* @returns a command line for stdio, or the URL for streamable-http.
*/
function describeTarget(entry) {
	return entry.transport === "stdio" ? [entry.command, ...entry.args].filter((part) => part.length > 0).join(" ") : entry.url;
}
//#endregion
//#region lib/types/tools.js
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
/** Build the shared pretty-JSON output declaration. */
function jsonOutput() {
	return {
		schema: { type: "json" },
		render: (_args, value) => [{
			type: "text",
			text: JSON.stringify(value, null, 2)
		}]
	};
}
/** Whether every element of an unknown array is a string. */
function isStringArray(value) {
	return Array.isArray(value) && value.every((item) => typeof item === "string");
}
/** Coerce a JSON argument into an array of strings, or reject it. */
function stringArray(value, field) {
	if (value === void 0) return [];
	/* v8 ignore next -- the `args` tool schema rejects a non-string array before execute runs */
	if (!isStringArray(value)) throw new Error(`"${field}" must be an array of strings`);
	return [...value];
}
/** Coerce a JSON argument into a string-to-string record, or reject it. */
function stringRecord(value, field) {
	if (value === void 0) return {};
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`"${field}" must be an object mapping names to strings`);
	const record = {};
	for (const [key, item] of Object.entries(value)) {
		if (typeof item !== "string") throw new Error(`"${field}.${key}" must be a string`);
		record[key] = item;
	}
	return record;
}
/** Build a registry entry from one add call, filling transport defaults. */
function entryFromArgs(args) {
	return {
		name: args.name,
		transport: args.transport,
		enabled: args.enabled ?? true,
		command: args.command ?? "",
		args: stringArray(args.args, "args"),
		env: stringRecord(args.env, "env"),
		cwd: args.cwd ?? "",
		url: args.url ?? "",
		headers: stringRecord(args.headers, "headers"),
		toolCallTimeoutMs: args.toolCallTimeoutMs ?? 6e4
	};
}
/** Shared parameter description for the server namespace. */
const NAME_DESCRIPTION = "Stable local namespace for this server (the model sees its tools as mcp__<name>__<tool>). Use [A-Za-z0-9_-], 1-32 characters; unique among configured servers.";
/**
* Build the management tools for one registry port.
* @param port - the live registry the tools read and mutate.
* @returns registry-ready tool definitions, in a stable order.
*/
function managerTools(port) {
	return [
		defineTool({
			name: "mcp_manager_list",
			description: "List the MCP servers configured for this harness with their transport, enabled state, connection status, and the tools each one currently contributes. Use it before adding or removing a server.",
			parameters: {},
			output: jsonOutput(),
			execute() {
				return Promise.resolve({ servers: port.list() });
			}
		}),
		defineTool({
			name: "mcp_manager_add",
			description: "Add an MCP server, or replace the entry with the same name. The harness mounts it immediately and its tools become callable as `mcp__<name>__<tool>`. For the stdio transport give command/args/env/cwd; for streamable-http give url/headers. Env values and headers carry credentials; prefer referencing a secret over pasting it.",
			parameters: {
				name: {
					type: "string",
					required: true,
					description: NAME_DESCRIPTION
				},
				transport: {
					type: "string",
					required: true,
					enum: ["stdio", "streamable-http"],
					description: "stdio spawns a local program; streamable-http connects to a service."
				},
				enabled: {
					type: "boolean",
					description: "Whether to mount the server now; defaults to true."
				},
				command: {
					type: "string",
					description: "stdio: executable to spawn, e.g. \"npx\"."
				},
				args: {
					type: "array",
					items: { type: "string" },
					description: "stdio: arguments passed without shell interpolation."
				},
				env: {
					type: "json",
					description: "stdio: extra environment variables as a string-to-string object."
				},
				cwd: {
					type: "string",
					description: "stdio: child working directory; omit to inherit."
				},
				url: {
					type: "string",
					description: "streamable-http: absolute http(s) MCP endpoint URL."
				},
				headers: {
					type: "json",
					description: "streamable-http: extra request headers as a string-to-string object."
				},
				toolCallTimeoutMs: {
					type: "number",
					description: "Per-tool-call timeout in milliseconds; defaults to 60000."
				}
			},
			output: jsonOutput(),
			async execute(args) {
				await port.upsert(entryFromArgs(args));
				return { servers: port.list() };
			}
		}),
		defineTool({
			name: "mcp_manager_remove",
			description: "Remove a configured MCP server. Its tools stop being callable immediately and the stored entry is deleted.",
			parameters: { name: {
				type: "string",
				required: true,
				description: NAME_DESCRIPTION
			} },
			output: jsonOutput(),
			async execute(args) {
				await port.remove(args.name);
				return { servers: port.list() };
			}
		}),
		defineTool({
			name: "mcp_manager_set_enabled",
			description: "Enable or disable a configured MCP server without deleting it. Disabling unmounts the client and removes its tools from the model view; enabling mounts it again.",
			parameters: {
				name: {
					type: "string",
					required: true,
					description: NAME_DESCRIPTION
				},
				enabled: {
					type: "boolean",
					required: true,
					description: "True to mount the server, false to unmount it."
				}
			},
			output: jsonOutput(),
			async execute(args) {
				await port.setEnabled(args.name, args.enabled);
				return { servers: port.list() };
			}
		})
	];
}
//#endregion
//#region lib/types/index.js
/**
* MCP manager plugin: one place to add, remove, enable, and disable external
* Model Context Protocol servers, and the mount loop that makes their tools
* callable as native harness tools.
*
* The plugin keeps a declarative registry of servers. The registry is stored in
* the `mcp-manager` user-settings section when a settings provider is composed
* (the Web profile mounts one), so the browser card and the model tools edit
* the same document. Reconciliation diffs that registry against live child
* `dsh-mcp-client` instances: a new or changed entry mounts a child fiber, a
* removed or disabled entry disposes one, and an unchanged entry keeps its
* connection and its stable `mcp__<name>__` tool names.
*
* Named exports (no default export) so the Loader reads `name`, `inject`, and
* `Config` for injection and validation.
*
* @module @ctl456/dsh-mcp-manager
*/
/** Cordis plugin name used by loader diagnostics. */
const name = "mcp-manager";
/** Services required before the plugin activates. */
const inject = ["tools"];
/** Settings namespace owning the server registry; the card keys on the same value. */
const SETTINGS_NS = "mcp-manager";
/**
* Register the manager: install the registry section, mount the current
* servers, expose the management tools, and reconcile on every settings change.
* @param ctx - the host context the manager is mounted on.
* @param config - the composition entry's registry, used as the settings base layer.
*/
function apply(ctx, config) {
	const mounted = /* @__PURE__ */ new Map();
	let currentServers = [...config.servers];
	let readSource = () => ({ servers: currentServers });
	let settings;
	let queue = Promise.resolve();
	const statusOf = (entry) => {
		const prefix = toolPrefix(entry.name);
		const tools = ctx.tools.schemas().map((schema) => schema.name).filter((schemaName) => schemaName.startsWith(prefix)).map((schemaName) => schemaName.slice(prefix.length));
		return {
			name: entry.name,
			transport: entry.transport,
			enabled: entry.enabled,
			connected: mounted.has(entry.name) && tools.length > 0,
			target: describeTarget(entry),
			tools,
			problems: validateServerEntry(entry)
		};
	};
	const list = () => readSource().servers.map(statusOf);
	const unmount = async (serverName) => {
		const live = mounted.get(serverName);
		mounted.delete(serverName);
		/* v8 ignore next -- reconcile only ever stops names it read from `mounted`, so the lookup always hits */
		if (live === void 0) return;
		try {
			await live.dispose();
		} catch (error) {
			/* v8 ignore next -- cordis contains an effect-disposer throw, so fiber.dispose() does not reject */
			ctx.logger.warn(`mcp-manager: disposing server "${serverName}" failed: ${String(error)}`);
		}
	};
	const reconcile = async () => {
		const plan = planReconcile(currentServers, new Map([...mounted].map(([serverName, live]) => [serverName, live.signature])));
		for (const serverName of plan.stop) await unmount(serverName);
		for (const entry of plan.start) {
			let fiber;
			try {
				fiber = ctx.plugin(McpClient, toClientConfig(entry));
				await fiber.await();
			} catch (error) {
				ctx.logger.error(`mcp-manager: mounting server "${entry.name}" failed: ${String(error)}`);
				continue;
			}
			mounted.set(entry.name, {
				signature: mountSignature(entry),
				dispose: () => fiber.dispose()
			});
		}
	};
	const schedule = () => {
		/* v8 ignore next -- reconcile contains every per-server failure, so only a defect can reject the queue */
		queue = queue.then(reconcile).catch((error) => {
			ctx.logger.error(`mcp-manager: reconciliation failed: ${String(error)}`);
		});
	};
	const persist = async (next) => {
		const previous = currentServers;
		currentServers = next;
		if (settings === void 0) {
			schedule();
			return;
		}
		try {
			await settings.update(SETTINGS_NS, { servers: next });
		} catch (error) {
			currentServers = previous;
			throw error;
		}
	};
	const upsert = async (entry) => {
		const problems = validateServerEntry(entry);
		if (problems.length > 0) throw new Error(`invalid MCP server "${entry.name}": ${problems.join("; ")}`);
		const next = currentServers.filter((candidate) => candidate.name !== entry.name);
		next.push(entry);
		await persist(next);
	};
	const remove = async (serverName) => {
		const next = currentServers.filter((candidate) => candidate.name !== serverName);
		if (next.length === currentServers.length) return;
		await persist(next);
	};
	const setEnabled = async (serverName, enabled) => {
		const next = currentServers.map((candidate) => candidate.name === serverName ? {
			...candidate,
			enabled
		} : candidate);
		if (next.every((candidate, index) => candidate.enabled === currentServers[index]?.enabled)) return;
		await persist(next);
	};
	const port = {
		list,
		upsert,
		remove,
		setEnabled
	};
	for (const tool of managerTools(port)) ctx.tools.register(tool);
	ctx.inject(["settings"], (settingsCtx) => {
		settings = settingsCtx.settings;
		settingsCtx.settings.installSection(ctx, SETTINGS_NS, Config, config, {
			setSource: (current) => {
				readSource = current;
				currentServers = current().servers;
			},
			onChange: () => {
				currentServers = readSource().servers;
				schedule();
			}
		});
		ctx.effect(() => () => {
			settings = void 0;
		}, "mcp-manager.settings-source");
	});
	schedule();
}
//#endregion
export { Config, SETTINGS_NS, apply, inject, name };
