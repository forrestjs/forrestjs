export function registerAction({ name, trace, target, handler, priority, optional, logLevel, ...meta }?: {
    name?: string;
    trace?: string;
    target?: string;
    handler?: () => void;
    priority?: number;
    optional?: boolean;
    logLevel?: any;
}): void;
