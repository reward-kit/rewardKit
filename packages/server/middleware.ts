import type { Middleware } from "swr";

export const logger: Middleware = (useSWRNext) => (key, fetcher, config) => {
    const wrapped = fetcher
        ? (...args: Parameters<typeof fetcher>) => {
            const start = performance.now();
            const result = fetcher(...args);
            Promise.resolve(result).finally(() => {
                console.debug(`[swr] ${String(key)} ${Math.round(performance.now() - start)}ms`);
            });
            return result;
        }
        : fetcher;

    return useSWRNext(key, wrapped, config);
};