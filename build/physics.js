import * as THREE from "three";
export let G = new THREE.Vector3(0, 0, -0.98);
export let sphs = []; // managing all fruits
// should consider frame
export class Physical {
    constructor(mesh, vel, isFixed) {
        this.mesh = mesh;
        this.vel = new THREE.Vector3(vel[0], vel[1], vel[2]);
        this.isFixed = isFixed;
    }
    getPosFromMesh() {
        return [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z];
    }
    getVelFromMesh() {
        return [this.vel.x, this.vel.y, this.vel.z];
    }
    nextPosition() {
        this.mesh.position.add(this.vel);
    }
    accelerate(acc) {
        this.vel.add(acc);
    }
}
;
export function physics(elements) {
    for (let i = 0; i < elements.length; i++) {
        // console.log(elements.getPosFromMesh()[0]);
        elements[i].nextPosition();
        elements[i].accelerate(G);
    }
}
//# sourceMappingURL=physics.js.map