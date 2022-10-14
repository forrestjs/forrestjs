export default run;
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
export type ForrestJSAppManifest = {
    services: Array.Object;
    features: Array.Object;
    settings: any | null;
    context: any | null;
    trace: (string | null) | null;
    logLevel: string | null;
};
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
 * @property {?Array.Object} services
 * @property {?Array.Object} features
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
export function run({ services, features, settings, context, trace, logLevel, }?: ForrestJSAppManifest): Promise<any>;
import { createApp } from "./create-app";
import { startApp } from "./create-app";
import { traceHook } from "./tracer";
import { logTrace } from "./tracer";
import { logBoot } from "./tracer";
import { registerAction } from "./register-action";
import { getTarget } from "./create-targets-registry";
import { createExtension } from "./create-extension";
export { createApp, startApp, traceHook, logTrace, logBoot, createAction, registerAction, getTarget, createExtension, CORE, BOOT, SERVICE, FEATURE, SYMBOLS, SEPARATOR, START, SETTINGS, INIT_SERVICE, INIT_SERVICES, INIT_FEATURE, INIT_FEATURES, START_SERVICE, START_SERVICES, START_FEATURE, START_FEATURES, FINISH };
