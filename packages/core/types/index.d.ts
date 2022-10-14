export = run;
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
 * @typedef {Object} ForrestJSAppManifest
 * @property {?Array.ForrestJSService} services
 * @property {?Array.ForrestJSFeature} features
 * @property {?Object} settings
 * @property {?Object} context
 * @property {?string|null} trace
 * @property {?string} logLevel
 */
/**
 * Executes a ForrestJS App
 *
 * @param {ForrestJSAppManifest} manifest
 * @returns {Promise}
 */
declare function run({ services, features, settings, context, trace, logLevel, }?: ForrestJSAppManifest): Promise<any>;
declare namespace run {
    export { ForrestJSGetter, ForrestJSContext, ForrestJSExtension, ForrestJSHandler, ForrestJSService, ForrestJSFeature, ForrestJSAppManifest };
}
type ForrestJSAppManifest = {
    services: Array.ForrestJSService;
    features: Array.ForrestJSFeature;
    settings: any | null;
    context: any | null;
    trace: (string | null) | null;
    logLevel: string | null;
};
type ForrestJSGetter = (key: string, defaultValue: any | null) => any;
type ForrestJSContext = {
    getConfig: ForrestJSGetter;
    setConfig: () => void;
    getContext: ForrestJSGetter;
    setContext: () => void;
};
type ForrestJSExtension = {
    target: string;
    handler: () => vlid;
};
type ForrestJSHandler = (target: ForrestJSContext) => Array.ForrestJSExtension;
type ForrestJSService = (target: ForrestJSContext) => Array.ForrestJSExtension;
type ForrestJSFeature = (target: any) => Array.ForrestJSExtension;
