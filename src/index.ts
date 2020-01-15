import { Plugin } from '@webvoxel/core';
import { Vector2, Raycaster, BoxGeometry, LineBasicMaterial, EdgesGeometry, LineSegments, Object3D } from 'three';
import _ from 'lodash';

export interface IReachPluginOptions {
    crosshair?: boolean | string;
};

export class ReachPlugin extends Plugin {
    private static CROSSHAIR_IMAGE: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAd0lEQVRYCe2TQQrAIAwE8/+H9JspvUk8zGFbhDKCoKwmy7hWhaO7r3WG5fLrq5lnnVcMK2iIAEpIQkSAdDMkISJAuhmS0MzA6X2dNjD7a2gSmXv6RKi/XhA7wgENAaDtU9D5z3WfjBBLSEJEgHQzJCEiQPrvM3QDBLTdXqOQprEAAAAASUVORK5CYII=';
    private raycaster = new Raycaster(); 
    private mouse = new Vector2(((window.innerWidth / 2) / window.innerWidth) * 2 - 1, -((window.innerHeight / 2) / window.innerHeight) * 2 + 1);
    private INTERSECTED?: Object3D;
    private crosshair: boolean | string;

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
            img.style.position = 'absolute';
            img.style.top = ((window.innerHeight / 2) - 18).toString() + 'px';
            img.style.left = ((window.innerWidth / 2) - 18).toString() + 'px';
            img.style.pointerEvents = 'none';

            if (this.crosshair === true) img.src = ReachPlugin.CROSSHAIR_IMAGE;
            else if (typeof this.crosshair === 'string') img.src = this.crosshair;

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
