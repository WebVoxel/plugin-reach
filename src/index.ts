import { Plugin } from '@webvoxel/core';
import { Vector2, Raycaster, BoxGeometry, LineBasicMaterial, EdgesGeometry, LineSegments, Object3D } from 'three';
import _ from 'lodash';

export interface IReachPluginOptions {
    crosshair?: boolean;
};

export class ReachPlugin extends Plugin {
    private static CROSSHAIR_IMAGE: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA4SURBVDhPY/z//z8DAVAPpRuhNFbABKUpBqMGEQaDzyBQOoKlE4oAVV0EZeIEoymbSmDYGsTAAAB8DQuYnqvtFAAAAABJRU5ErkJggg==';
    private raycaster = new Raycaster(); 
    private mouse = new Vector2(((window.innerWidth / 2) / window.innerWidth) * 2 - 1, -((window.innerHeight / 2) / window.innerHeight) * 2 + 1);
    private INTERSECTED?: Object3D;
    private crosshair: boolean;

    constructor(options?: IReachPluginOptions) {
        super('reach', {
            dependencies: [
                'wasdcontrols',
            ],
        });
        
        this.crosshair = options && options.crosshair || false;
    }

    public init(): void {
        if (this.crosshair) {
            const img = document.createElement('img');

            img.src = ReachPlugin.CROSSHAIR_IMAGE;
            img.style.position = 'absolute';
            img.style.top = ((window.innerHeight / 2) - 18).toString() + 'px';
            img.style.left = ((window.innerWidth / 2) - 18).toString() + 'px';
            img.style.pointerEvents = 'none';

            document.body.appendChild(img);
        }

        this.on('animate', () => {
            this.raycaster.setFromCamera(this.mouse, this.game!.camera);
            const intersects = this.raycaster.intersectObjects(this.game!.currentWorld.scene.children);

            if (intersects.length > 0) {
                if (!_.isEqual(this.INTERSECTED, intersects[0].object)) {
                    if (this.INTERSECTED) this.INTERSECTED!.children = [];

                    this.INTERSECTED = intersects[0].object;
                    const geometry = new BoxGeometry(1, 1, 1);
                    const edges = new EdgesGeometry(geometry);
                    const line = new LineSegments(edges, new LineBasicMaterial({
                        color: 0x000000,
                        linewidth: 2,
                    }));
                    this.INTERSECTED.add(line);
                }
            } else {
                if (this.INTERSECTED) this.INTERSECTED!.children = []
                this.INTERSECTED = undefined;
            }
        });
    }
}