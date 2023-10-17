import * as THREE from 'three';
import * as PHYS from './physics.js';
export declare let camera: THREE.PerspectiveCamera;
export declare let scene: THREE.Scene;
export declare let renderer: THREE.WebGLRenderer;
export declare let fps: number;
export declare function createSph(rank: number, textureName: string, position: number[], rotation: number[]): THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
export declare function createColorSph(rank: number, position: number[], rotation: number[]): THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
export declare function rankUpSph(sph: PHYS.Physical): void;
export declare let config: {
    radius: number;
    mass: number;
    texture: string;
    color: THREE.Color;
    name: string;
}[];
