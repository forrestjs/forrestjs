export function appendAction(hook: any, action: any): void;
export function appendTrace(id: any, payload: any): void;
export function deleteTrace(id: any): void;
export function getHook(hook: any): any;
export function getCurrentStack(): any[];
export function getTraceContext(id: any): any;
export function getState(): {
    hooks: {};
    trace: {};
    stack: any[];
};
export function resetState(): void;
