export function run({ services, features, settings, context, trace, logLevel, }?: ForrestJSAppManifest): Promise<any>;
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
    services: Array.ForrestJSService;
    features: Array.ForrestJSFeature;
    settings: any | null;
    context: any | null;
    trace: (string | null) | null;
    logLevel: string | null;
};
declare namespace __src_index_ { }
