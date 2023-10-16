import * as THREE from 'three';
export declare let camera: THREE.PerspectiveCamera;
export declare let scene: THREE.Scene;
export declare let renderer: THREE.WebGLRenderer;
export declare let fps: number;
export declare function createSph(radius: number, textureName: string, position: number[], rotation: number[]): THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
export declare function createColorSph(Rank: number, position: number[], rotation: number[]): THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
export declare let config: {
    radius: number;
    mass: number;
    texture: string;
    color: THREE.Color;
    name: string;
}[];
