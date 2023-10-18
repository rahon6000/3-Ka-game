import * as THREE from 'three';
import * as PHYS from './physics.js';
export declare let camera: THREE.PerspectiveCamera;
export declare let scene: THREE.Scene;
export declare let renderer: THREE.WebGLRenderer;
export declare let fps: number;
export declare let guideLine: THREE.Mesh;
export declare let guideSphere: THREE.Mesh;
export declare let config: {
    radius: number;
    mass: number;
    texture: string;
    color: THREE.Color;
    name: string;
}[];
export declare function createColorSph(rank: number, position: number[], rotation: number[]): void;
export declare function rankUpSph(sph: PHYS.Physical): void;
export declare function renewGuideSphere(): void;
export declare function gameOver(): void;
