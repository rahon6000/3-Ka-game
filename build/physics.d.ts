import * as THREE from "three";
export declare let G: THREE.Vector3;
export declare let sphs: Physical[];
export declare let side: number;
export declare let height: number;
export declare let dropMargin: number;
export declare class Physical {
    mass: number;
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    rank: number;
    radius: number;
    isCollide: boolean;
    isReservedToDestroyed: boolean;
    isEverCollide: boolean;
    constructor(mesh: THREE.Mesh, vel: number[], rank: number, radius: number);
    getPosFromMesh(): number[];
    getVelFromMesh(): number[];
    nextPosition(): void;
    accelerate(acc: THREE.Vector3): void;
    checkWallCollision(): void;
    checkCollisionWith(x: Physical): void;
    sphereFusion(sph: Physical): void;
    checkGameOver(): void;
}
export declare function physics(elements: Physical[]): void;
