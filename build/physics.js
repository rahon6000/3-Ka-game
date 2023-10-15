import * as THREE from "three";
let gravity = 0.098; // At what framerate? 120?
export let G = new THREE.Vector3(0, 0, -gravity);
export let sphs = []; // managing all fruits
export let side = 100;
export let height = 300;
let halfHeight = height * 0.5;
let floorElasticity = 0.48;
let sideWallElasticity = 0.9;
let stillness = 4 * gravity;
// should consider frame
export class Physical {
    constructor(mesh, vel, isFixed, radius) {
        this.mesh = mesh;
        this.vel = new THREE.Vector3(vel[0], vel[1], vel[2]);
        this.isFixed = isFixed;
        this.radius = radius;
        this.isCollide = false;
    }
    getPosFromMesh() {
        return [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z];
    }
    getVelFromMesh() {
        return [this.vel.x, this.vel.y, this.vel.z];
    }
    nextPosition() {
        if (this.isCollide) {
            // precalculated movement. skip this frame.
            this.isCollide = false;
        }
        else {
            this.mesh.position.add(this.vel);
            this.accelerate(G);
        }
    }
    accelerate(acc) {
        this.vel.add(acc);
    }
    checkWallCollision() {
        // floor (set this -height )
        if (this.radius - this.mesh.position.z > halfHeight) {
            // simple solution, no fast moving friends
            this.isCollide = true;
            this.mesh.position.x += this.vel.x;
            this.mesh.position.y += this.vel.y;
            if (this.vel.length() < stillness) {
                this.vel.z = 0;
                this.mesh.position.z = this.radius - halfHeight;
            }
            else {
                this.vel.z = -this.vel.z * floorElasticity;
                this.mesh.position.z += this.vel.z - (this.mesh.position.z - this.radius + halfHeight) * floorElasticity;
            }
        }
        // side walls (set them at \pm side)
        if (this.mesh.position.x + this.radius > side || this.radius - this.mesh.position.x > side) { // apply if above works
            this.isCollide = true;
            this.vel.x = -this.vel.x * sideWallElasticity;
        }
        if (this.mesh.position.y + this.radius > side || this.radius - this.mesh.position.y > side) { // apply if above works...
            this.isCollide = true;
            this.vel.y = -this.vel.y * sideWallElasticity;
        }
        // above code should be revised not to tunnel thru wall.
        // If I precalculate here, what about nextPosition()...? OK i use flag.
    }
    checkCollisionWith(x) {
        if (this.radius + x.radius > this.mesh.position.distanceTo(x.mesh.position)) {
            // MATH...!!! 😢
            // Use below variables... It seems complicated. 
            this.vel;
            x.vel;
            this.mesh.position;
            x.mesh.position;
        }
    }
}
;
export function physics(elements) {
    for (let i = 0; i < elements.length; i++) {
        // Collision with side wall and floor might be treated as special case?? it only cost O(N).
        elements[i].checkWallCollision();
        // let someGroupThatPossiblyCollideWith: Physical[] = [elements[1]];    // This line should be elaborated later...!!! el[1] is used as dummy.
        // someGroupThatPossiblyCollideWith.forEach((x: Physical) => {
        //   elements[i].checkCollisionWith(x);
        // });
        // After all are done move to next position.
        elements[i].nextPosition(); // and also accelerate.
    }
}
//# sourceMappingURL=physics.js.map