import * as THREE from "three";
export declare let G: THREE.Vector3;
export declare let sphs: Physical[];
export declare let side: number;
export declare let height: number;
export declare class Physical {
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    isFixed: boolean;
    radius: number;
    isCollide: boolean;
    constructor(mesh: THREE.Mesh, vel: number[], isFixed: boolean, radius: number);
    getPosFromMesh(): number[];
    getVelFromMesh(): number[];
    nextPosition(): void;
    accelerate(acc: THREE.Vector3): void;
    checkWallCollision(): void;
    checkCollisionWith(x: Physical): void;
}
export declare function physics(elements: Physical[]): void;
