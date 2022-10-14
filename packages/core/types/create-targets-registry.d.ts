export function createRegistry(initialExtensions?: {}, { registryName }?: {
    registryName: any;
}): {
    registerTargets: (name?: {}) => void;
    getTarget: (name: any) => any;
    getTargets: () => {};
};
export function getTarget(hookName: any, registryName?: string): any;
export function resetState(): void;
