export function log(text: any): void;
export function logAction(text: any, action: any): void;
/**
 * Creates a logger instance that logs to the console
 * @param {String} LOG_LEVEL max level to log
 * @param {Function} transport a logger function
 * @returns
 */
export function makeLogger(logLevel?: string, { transport, levelsMap }?: Function): {
    (level: string, ag1: any, ...args: any[]): void;
    cloneWithLogLevel(logLevel: any): any;
};
/**
 * Converts a log level name into a log level number
 * @param {String} level log level name
 * @param {Object} levels log levels map
 * @param {Number} defaultValue default value in case the level is not mapped
 * @returns
 */
export function getLevelNumber(level: string, levels?: any, defaultValue?: number): any;
export namespace LOG_LEVELS {
    const error: number;
    const warn: number;
    const info: number;
    const http: number;
    const verbose: number;
    const debug: number;
    const silly: number;
}
