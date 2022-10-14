export type ForrestJSGetter = (key: string, defaultValue: any | null) => any;
export type ForrestJSContext = {
    getConfig: ForrestJSGetter;
    setConfig: () => void;
    getContext: ForrestJSGetter;
    setContext: () => void;
};
export type ForrestJSExtension = {
    target: string;
    handler: () => vlid;
};
export type ForrestJSHandler = (target: ForrestJSContext) => Array.ForrestJSExtension;
export type ForrestJSService = (target: ForrestJSContext) => Array.ForrestJSExtension;
export type ForrestJSFeature = (target: any) => Array.ForrestJSExtension;
export type ForrestJSApp = {
    services: Array.ForrestJSService;
    features: Array.ForrestJSFeature;
    settings: any;
    context: any;
    trace: string | null;
    logLevel: string;
};
/**
 * Creates a ForrestJS App
 *
 * @param {ForrestJSApp} appManifest
 * @returns {Promise}
 */
export function createApp({ services, features, settings, context, trace, logLevel, }?: ForrestJSApp): Promise<any>;
/**
 * Executes a ForrestJS App
 *
 * @param {ForrestJSApp} appManifest
 * @returns {Promise}
 */
export function startApp({ services, features, settings, context, trace, logLevel, }?: ForrestJSApp): Promise<any>;
/**
 * @callback ForrestJSGetter
 * @param {string} key
 * @param {?any} defaultValue
 * @returns {any}
 */
/**
 * @typedef {Object} ForrestJSContext
 * @property {ForrestJSGetter} getConfig
 * @property {() => void} setConfig
 * @property {ForrestJSGetter} getContext
 * @property {() => void} setContext
 */
/**
 * @typedef {Object} ForrestJSExtension
 * @property {string} target
 * @property {() => vlid} handler
 */
/**
 * @callback ForrestJSHandler
 * @param {ForrestJSContext} target
 * @returns {Array.ForrestJSExtension}
 */
/**
 * @callback ForrestJSService
 * @param {ForrestJSContext} target
 * @returns {Array.ForrestJSExtension}
 */
/**
 * @callback ForrestJSFeature
 * @param {Object} target
 * @returns {Array.ForrestJSExtension}
 */
/**
 * @typedef {Object} ForrestJSApp
 * @property {Array.ForrestJSService} services
 * @property {Array.ForrestJSFeature} features
 * @property {Object} settings
 * @property {Object} context
 * @property {string|null} trace
 * @property {string} logLevel
 */
export function isDeclarativeAction({ target, handler }: {
    target: any;
    handler: any;
}, integrationName: any, integrationType: any): boolean;
export function isListOfDeclarativeActions(list: any, integrationName: any, integrationType: any): boolean;
