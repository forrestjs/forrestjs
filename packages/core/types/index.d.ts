export = run;
/**
 * @callback ForrestJSGetter
 * @param {string} key
 * @param {any} [defaultValue]
 * @returns {any}
 */
/**
 * @callback ForrestJSSetter
 * @param {string} key
 * @param {any} value
 * @returns {any}
 */
/**
 * @callback ForrestJSRegisterTargets
 * @param {Object} targets
 * @returns {void}
 */
/**
 * @typedef {Object} ForrestJSExtensionLog
 * @property {name} string
 * @property {hook} string
 * @property {priority} number
 * @property {trace} any
 * @property {boolean} enabled
 * @property {optional} enabled
 * @property {function} handler
 * @property {logLevel} string
 * @property {Object} meta
 */
/**
 * @typedef {Object} ForrestJSActionLog
 * @property {any} args
 * @property {ForrestJSContext} context
 * @property {string} mode
 * @property {function} onError
 * @property {function} onItemError
 * @property {any} trace
 */
/**
 * @callback ForrestJSCreateSyncExtension
 * @param {String} target
 * @param {Object} params
 * @returns {Array.<any, ForrestJSExtensionLog, ForrestJSActionLog>}
 */
/**
 * @callback ForrestJSCreateAsycExtension
 * @param {String} target
 * @param {Object} params
 * @returns {Promise}
 */
/**
 * @typedef {Object} ForrestJSCreateExtension
 * @property {ForrestJSCreateSyncExtension} sync
 * @property {ForrestJSCreateSyncExtension} waterfall
 * @property {ForrestJSCreateAsycExtension} serie
 * @property {ForrestJSCreateAsycExtension} parallel
 */
/**
 * @typedef {Object} ForrestJSLogger
 * @property {function} error
 * @property {function} warn
 * @property {function} info
 * @property {function} http
 * @property {function} verbose
 * @property {function} debug
 * @property {function} silly
 */
/**
 * @typedef {Object} ForrestJSContext
 * @property {ForrestJSLogger} log
 * @property {ForrestJSGetter} getConfig
 * @property {ForrestJSSetter} setConfig
 * @property {ForrestJSGetter} getContext
 * @property {ForrestJSSetter} setContext
 * @property {ForrestJSRegisterTargets} registerTargets
 * @property {ForrestJSCreateExtension} createExtension
 */
/**
 * @interface ForrestJSParams
 */
/**
 * @callback ForrestJSHandler
 * @param {ForrestJSParams} params
 * @param {ForrestJSContext} context
 * @returns {any}
 */
/**
 * @typedef {Object} ForrestJSExtension
 * @property {string} target
 * @property {ForrestJSHandler} handler
 * @property {boolean} [enabled]
 * @property {boolean} [optional]
 * @property {string} [name]
 * @property {string} [trace]
 * @property {string} [logLevel]
 * @property {Object} [meta]
 * @property {number} [priority]
 */
/**
 * @callback ForrestJSService
 * @param {ForrestJSContext} context
 * @returns {ForrestJSExtension|Array.<ForrestJSExtension>}
 */
/**
 * @callback ForrestJSFeature
 * @param {ForrestJSContext} context
 * @returns {ForrestJSExtension|Array.<ForrestJSExtension>}
 */
/**
 * @typedef {Object} ForrestJSAppManifest
 * @property {Array.<ForrestJSService|ForrestJSExtension>} [services = []]
 * @property {Array.<ForrestJSFeature|ForrestJSExtension>} [features = []]
 * @property {Object} [settings = {}]
 * @property {Object} [context = {}]
 * @property {string|null} [trace]
 * @property {string} [logLevel = 'info']
 */
/**
 * Executes a ForrestJS App
 *
 * @param {ForrestJSAppManifest} manifest
 * @returns {Promise}
 */
declare function run({ services, features, settings, context, trace, logLevel, }?: ForrestJSAppManifest): Promise<any>;
declare namespace run {
    export { run, createApp, startApp, traceHook, logTrace, logBoot, createAction, registerAction, getTarget, createExtension, CORE, BOOT, SERVICE, FEATURE, SYMBOLS, SEPARATOR, START, SETTINGS, INIT_SERVICE, INIT_SERVICES, INIT_FEATURE, INIT_FEATURES, START_SERVICE, START_SERVICES, START_FEATURE, START_FEATURES, FINISH, ForrestJSGetter, ForrestJSSetter, ForrestJSRegisterTargets, ForrestJSExtensionLog, ForrestJSActionLog, ForrestJSCreateSyncExtension, ForrestJSCreateAsycExtension, ForrestJSCreateExtension, ForrestJSLogger, ForrestJSContext, ForrestJSHandler, ForrestJSExtension, ForrestJSService, ForrestJSFeature, ForrestJSAppManifest };
}
type ForrestJSAppManifest = {
    services?: Array<ForrestJSService | ForrestJSExtension>;
    features?: Array<ForrestJSFeature | ForrestJSExtension>;
    settings?: any;
    context?: any;
    trace?: string | null;
    logLevel?: string;
};
import { createApp } from "./create-app";
import { startApp } from "./create-app";
import { traceHook } from "./tracer";
import { logTrace } from "./tracer";
import { logBoot } from "./tracer";
import { registerAction } from "./register-action";
import { getTarget } from "./create-targets-registry";
import { createExtension } from "./create-extension";
type ForrestJSGetter = (key: string, defaultValue?: any) => any;
type ForrestJSSetter = (key: string, value: any) => any;
type ForrestJSRegisterTargets = (targets: any) => void;
type ForrestJSExtensionLog = {
    string: void;
    number: priority;
    any: trace;
    enabled: boolean;
    handler: Function;
    meta: any;
};
type ForrestJSActionLog = {
    args: any;
    context: ForrestJSContext;
    mode: string;
    onError: Function;
    onItemError: Function;
    trace: any;
};
type ForrestJSCreateSyncExtension = (target: string, params: any) => Array<any, ForrestJSExtensionLog, ForrestJSActionLog>;
type ForrestJSCreateAsycExtension = (target: string, params: any) => Promise<any>;
type ForrestJSCreateExtension = {
    sync: ForrestJSCreateSyncExtension;
    waterfall: ForrestJSCreateSyncExtension;
    serie: ForrestJSCreateAsycExtension;
    parallel: ForrestJSCreateAsycExtension;
};
type ForrestJSLogger = {
    error: Function;
    warn: Function;
    info: Function;
    http: Function;
    verbose: Function;
    debug: Function;
    silly: Function;
};
type ForrestJSContext = {
    log: ForrestJSLogger;
    getConfig: ForrestJSGetter;
    setConfig: ForrestJSSetter;
    getContext: ForrestJSGetter;
    setContext: ForrestJSSetter;
    registerTargets: ForrestJSRegisterTargets;
    createExtension: ForrestJSCreateExtension;
};
type ForrestJSHandler = (params: ForrestJSParams, context: ForrestJSContext) => any;
type ForrestJSExtension = {
    target: string;
    handler: ForrestJSHandler;
    enabled?: boolean;
    optional?: boolean;
    name?: string;
    trace?: string;
    logLevel?: string;
    meta?: any;
    priority?: number;
};
type ForrestJSService = (context: ForrestJSContext) => ForrestJSExtension | Array<ForrestJSExtension>;
type ForrestJSFeature = (context: ForrestJSContext) => ForrestJSExtension | Array<ForrestJSExtension>;
