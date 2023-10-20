import * as THREE from 'three';
import * as PHYS from './physics.js';
export declare let camera: THREE.PerspectiveCamera;
export declare let scene: THREE.Scene;
export declare let renderer: THREE.WebGLRenderer;
export declare let fps: number;
export declare let guideLine: THREE.Mesh;
export declare let guideSphere: THREE.Mesh;
interface configElem {
    radius: 0;
    mass: 0;
    texture: "";
    color: "";
    name: "";
}
export declare let config: configElem[];
export declare function createColorSph(rank: number, position: number[], rotation: number[]): void;
export declare function rankUpSph(sph: PHYS.Physical): void;
export declare function killSph(sph: PHYS.Physical): void;
export declare function renewGuideSphere(): void;
export declare function gameOver(): void;
export {};
