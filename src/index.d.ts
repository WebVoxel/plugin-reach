import { Plugin } from '@webvoxel/core';
export interface IReachPluginOptions {
    crosshair?: boolean | string;
}
export declare class ReachPlugin extends Plugin {
    private static CROSSHAIR_IMAGE;
    private raycaster;
    private mouse;
    private INTERSECTED?;
    private crosshair;
    constructor(options?: IReachPluginOptions);
    init(): void;
}
