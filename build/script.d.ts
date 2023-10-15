import * as THREE from 'three';
export declare let camera: THREE.PerspectiveCamera;
export declare let scene: THREE.Scene;
export declare let renderer: THREE.WebGLRenderer;
export declare function createSph(radius: number, textureName: string, position: number[], rotation: number[]): THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
