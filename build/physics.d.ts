import * as THREE from "three";
export declare let G: THREE.Vector3;
export declare let sphs: Physical[];
export declare class Physical {
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    constructor(mesh: THREE.Mesh, vel: number[]);
    getPosFromMesh(): number[];
    getVelFromMesh(): number[];
    nextPosition(): void;
    accelerate(acc: THREE.Vector3): void;
}
export declare function physics(elements: Physical[]): void;
