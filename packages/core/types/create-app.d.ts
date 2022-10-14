/**
 * Creates a ForrestJS App
 *
 * @param {ForrestJSApp} appManifest
 * @returns {Promise}
 */
export function createApp({ services, features, settings, context, trace, logLevel, }?: ForrestJSApp): Promise<any>;
export function startApp({ services, features, settings, context, trace, logLevel, }?: {
    services?: any[];
    features?: any[];
    settings?: {};
    context?: {};
    trace?: any;
    logLevel: any;
}): any;
export function isDeclarativeAction({ target, handler }: {
    target: any;
    handler: any;
}, integrationName: any, integrationType: any): boolean;
export function isListOfDeclarativeActions(list: any, integrationName: any, integrationType: any): boolean;
