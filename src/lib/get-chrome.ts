export function getChrome(): typeof chrome {
    if (typeof chrome !== "undefined") return chrome;
    // dev mock fallback
    return {
        storage: {
            local: {
                get: async () => ({}),
                set: async () => { },
            },
        },
    } as any;
}