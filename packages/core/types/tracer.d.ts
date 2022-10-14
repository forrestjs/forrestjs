export function traceAction(action: any, options?: {}): void;
export function nestObjects(list: any): any;
export function traceHook(ctx?: string): (density?: string) => (output?: string) => any;
export namespace traceHook {
    function getHooks(a: any): any;
}
export function logTrace(log: any): (ctx: any) => (options?: {}) => void;
export function logBoot(log?: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
}): void;
