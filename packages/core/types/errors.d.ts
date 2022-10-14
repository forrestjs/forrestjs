export class ForrestJSGetConfigError extends Error {
    constructor(message: any);
}
export class ForrestJSGetContextError extends Error {
    constructor(message: any);
}
export class ForrestJSUnknownTargetError extends Error {
    constructor(message: any);
}
export class ForrestJSInvalidTargetError extends Error {
    constructor(message: any);
}
export class ForrestJSInvalidHandlerError extends Error {
    constructor(message: any);
}
export class ForrestJSCreateExtensionError extends Error {
    constructor(message: any);
}
export class ForrestJSRegisterActionError extends Error {
    constructor(message: any, props: any);
    target: any;
    action: any;
    trace: any;
}
export function onItemError(error: any, action: any): never;
