/** `settings.mcp-manager` dictionary: the MCP server card's copy. */
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    title: string;
    description: string;
    unavailable: string;
    readOnly: string;
    empty: string;
    servers: string;
    search: string;
    searchPlaceholder: string;
    noMatch: string;
    addServer: string;
    addTitle: string;
    close: string;
    cancel: string;
    prevPage: string;
    nextPage: string;
    pageInfo: string;
    name: string;
    nameHint: string;
    transport: string;
    transportStdio: string;
    transportHttp: string;
    transportHint: string;
    command: string;
    commandHint: string;
    args: string;
    argsHint: string;
    env: string;
    envHint: string;
    cwd: string;
    cwdHint: string;
    url: string;
    urlHint: string;
    headers: string;
    headersHint: string;
    timeout: string;
    timeoutHint: string;
    add: string;
    discard: string;
    remove: string;
    enable: string;
    disable: string;
    enabled: string;
    disabled: string;
    target: string;
    errorName: string;
    errorDuplicate: string;
    errorCommand: string;
    errorUrl: string;
    errorEnv: string;
    errorHeaders: string;
    errorTimeout: string;
    saveFailed: string;
};
/** The settings.mcp-manager namespace key union. */
export type McpManagerKey = keyof typeof zh;
/** English dictionary, checked complete against the zh key set. */
export declare const en: {
    title: string;
    description: string;
    unavailable: string;
    readOnly: string;
    empty: string;
    servers: string;
    search: string;
    searchPlaceholder: string;
    noMatch: string;
    addServer: string;
    addTitle: string;
    close: string;
    cancel: string;
    prevPage: string;
    nextPage: string;
    pageInfo: string;
    name: string;
    nameHint: string;
    transport: string;
    transportStdio: string;
    transportHttp: string;
    transportHint: string;
    command: string;
    commandHint: string;
    args: string;
    argsHint: string;
    env: string;
    envHint: string;
    cwd: string;
    cwdHint: string;
    url: string;
    urlHint: string;
    headers: string;
    headersHint: string;
    timeout: string;
    timeoutHint: string;
    add: string;
    discard: string;
    remove: string;
    enable: string;
    disable: string;
    enabled: string;
    disabled: string;
    target: string;
    errorName: string;
    errorDuplicate: string;
    errorCommand: string;
    errorUrl: string;
    errorEnv: string;
    errorHeaders: string;
    errorTimeout: string;
    saveFailed: string;
};
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The MCP server card's copy. */
        'settings.mcp-manager': McpManagerKey;
    }
}
//# sourceMappingURL=locales.d.ts.map