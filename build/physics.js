import * as THREE from "three";
import { rankUpSph } from "./script.js";
let gravity = 0.098; // At what framerate? 120?
export let G = new THREE.Vector3(0, 0, -gravity);
export let sphs = []; // managing all fruits
export let side = 100;
export let height = 300;
export let dropMargin = 30;
let halfHeight = height * 0.5;
// Physical properties...
let floorElasticity = 0.5;
let sideWallElasticity = 0;
let interSphereElasticity = 0.5;
let sphereFriction = 0.7;
let stillness = 4 * gravity;
let wallOverwrapCoeff = 0.1;
let overwrapRepulsion = 0.5;
let tmp = new THREE.Vector3();
// should consider frame
export class Physical {
    constructor(mesh, vel, rank, radius) {
        this.mesh = mesh;
        this.vel = new THREE.Vector3(vel[0], vel[1], vel[2]);
        this.rank = rank;
        this.radius = radius;
        this.isCollide = false;
        this.mass = 1;
        this.isReservedToDestroyed = false;
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
        let overwrap = this.radius - (this.mesh.position.z + this.vel.z) - halfHeight;
        if (overwrap > 0) {
            // simple solution, no fast moving friends
            this.isCollide = true;
            this.mesh.position.x += this.vel.x;
            this.mesh.position.y += this.vel.y;
            this.vel.x *= 0.99;
            this.vel.y *= 0.99; //friction
            if (this.vel.length() < stillness) {
                this.vel.z = 0;
                this.mesh.position.z = this.radius - halfHeight;
            }
            else {
                this.mesh.position.z = this.radius - halfHeight;
                this.vel.z = Math.floor(Math.abs(this.vel.z) * 2) * 0.5 * floorElasticity;
                this.mesh.position.z += this.vel.z;
            }
        }
        // side wall edge
        let edgeDist = new THREE.Vector3();
        let edgeCollisionVector = new THREE.Vector3();
        if (this.mesh.position.z > halfHeight) {
            edgeDist.set(this.mesh.position.x + this.vel.x - side, 0, this.mesh.position.z + this.vel.z - halfHeight);
            if (edgeDist.length() < this.radius) {
                this.isCollide = true;
                edgeCollisionVector = this.vel.projectOnVector(edgeDist.normalize());
                this.vel.add(edgeCollisionVector.negate());
            }
            edgeDist.set(this.mesh.position.x + this.vel.x + side, 0, this.mesh.position.z + this.vel.z - halfHeight);
            if (edgeDist.length() < this.radius) {
                this.isCollide = true;
                edgeCollisionVector = this.vel.projectOnVector(edgeDist.normalize());
                this.vel.add(edgeCollisionVector.negate());
            }
            edgeDist.set(0, this.mesh.position.y + this.vel.y - side, this.mesh.position.z + this.vel.z - halfHeight);
            if (edgeDist.length() < this.radius) {
                this.isCollide = true;
                edgeCollisionVector = this.vel.projectOnVector(edgeDist.normalize());
                this.vel.add(edgeCollisionVector.negate());
            }
            edgeDist.set(0, this.mesh.position.y + this.vel.y + side, this.mesh.position.z + this.vel.z - halfHeight);
            if (edgeDist.length() < this.radius) {
                this.isCollide = true;
                edgeCollisionVector = this.vel.projectOnVector(edgeDist.normalize());
                this.vel.add(edgeCollisionVector.negate());
            }
        }
        else {
            // side walls
            let nextXpos = this.mesh.position.x + this.vel.x;
            overwrap = nextXpos + this.radius - side;
            if (overwrap > 0) { // apply if above works
                this.isCollide = true;
                this.vel.x = -Math.abs(this.vel.x) * sideWallElasticity;
                this.mesh.position.x += this.vel.x;
                //
                overwrap = this.mesh.position.x + this.radius - side;
                while (overwrap > 0) {
                    this.vel.x += -overwrap * wallOverwrapCoeff;
                    this.mesh.position.x += this.vel.x;
                    overwrap = this.mesh.position.x + this.radius - side;
                }
            }
            overwrap = this.radius - nextXpos - side;
            if (overwrap > 0) {
                this.isCollide = true;
                this.vel.x = Math.abs(this.vel.x) * sideWallElasticity;
                this.mesh.position.x += this.vel.x;
                //
                overwrap = -this.mesh.position.x + this.radius - side;
                while (overwrap > 0) {
                    this.vel.x += overwrap * wallOverwrapCoeff;
                    this.mesh.position.x += this.vel.x;
                    overwrap = -this.mesh.position.x + this.radius - side;
                }
            }
            let nextYpos = this.mesh.position.y + this.vel.y;
            overwrap = nextYpos + this.radius - side;
            if (overwrap > 0) { // apply if above works
                this.isCollide = true;
                this.vel.y = -Math.abs(this.vel.y) * sideWallElasticity;
                this.mesh.position.y += this.vel.y;
                //
                overwrap = this.mesh.position.y + this.radius - side;
                while (overwrap > 0) {
                    this.vel.y += -overwrap * wallOverwrapCoeff;
                    this.mesh.position.y += this.vel.y;
                    overwrap = this.mesh.position.y + this.radius - side;
                }
            }
            overwrap = this.radius - nextYpos - side;
            if (overwrap > 0) {
                this.isCollide = true;
                this.vel.y = Math.abs(this.vel.y) * sideWallElasticity;
                this.mesh.position.y += this.vel.y;
                //
                overwrap = -this.mesh.position.y + this.radius - side;
                while (overwrap > 0) {
                    this.vel.y += overwrap * wallOverwrapCoeff;
                    this.mesh.position.y += this.vel.y;
                    overwrap = -this.mesh.position.y + this.radius - side;
                }
            }
        }
        // above code should be revised not to tunnel thru wall.
        // If I precalculate here, what about nextPosition()...? OK i use flag.
    }
    checkCollisionWith(x) {
        let objA = this.mesh.position.clone();
        let objB = x.mesh.position.clone();
        if (this.radius + x.radius > (objA.add(this.vel)).distanceTo(objB.add(x.vel))) {
            if (this.radius === x.radius) {
                this.sphereFusion(x);
                return;
            }
            // MATH...!!! 😢
            // Use below variables... It seems complicated.
            let lineV = objA.sub(objB).normalize();
            let normalVelA = this.vel.clone().projectOnVector(lineV);
            let normalVelB = x.vel.clone().projectOnVector(lineV);
            this.vel.sub(normalVelA).multiplyScalar(sphereFriction);
            x.vel.sub(normalVelB).multiplyScalar(sphereFriction);
            let amplA = normalVelA.dot(lineV); // this don't use sqrt!
            let amplB = normalVelB.dot(lineV);
            let massSum = this.mass + x.mass;
            normalVelA = lineV.clone().multiplyScalar((amplA * (this.mass - x.mass) + amplB * (2 * x.mass)) / massSum);
            normalVelB = lineV.clone().multiplyScalar((amplA * (2 * this.mass) + amplB * (x.mass - this.mass)) / massSum);
            this.vel.add(normalVelA.multiplyScalar(interSphereElasticity));
            this.vel.add(normalVelB.multiplyScalar(interSphereElasticity));
            // this.vel.sub(normalVelA);
            // x.vel.sub(normalVelB);
            this.mesh.position.add(this.vel);
            x.mesh.position.add(x.vel);
            let overwrap = (this.radius + x.radius) - tmp.subVectors(this.mesh.position, x.mesh.position).length();
            if (overwrap > 0) {
                lineV.multiplyScalar(overwrap * 0.5); // reposition to just-contact.
                this.mesh.position.add(lineV);
                x.mesh.position.sub(lineV);
                lineV.multiplyScalar(overwrapRepulsion);
                x.vel.add(lineV);
                this.vel.add(lineV);
            }
        }
    }
    sphereFusion(sph) {
        console.log("same sphs touched!");
        this.mesh.position.add(sph.mesh.position).multiplyScalar(0.5);
        this.vel.multiplyScalar(0);
        this.isCollide = true;
        rankUpSph(this);
        sph.mesh.position.set(0, 0, 10000);
        sph.vel.multiplyScalar(0);
        sph.isReservedToDestroyed = true;
        sph.isCollide = true;
    }
}
;
export function physics(elements) {
    for (let i = 0; i < elements.length; i++) {
        // Collision with side wall and floor might be treated as special case?? it only cost O(N).
        elements[i].checkWallCollision();
        // spheres 사라지는 경우 주의...
        for (let j = 0; j < elements.length; j++) {
            if (i === j)
                continue;
            elements[i].checkCollisionWith(elements[j]);
        }
        // After all are done move to next position.
        elements[i].nextPosition(); // and also accelerate.
    }
    // Remove sphes
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].isReservedToDestroyed) {
            elements = elements.splice(i, 1);
        }
    }
}
//# sourceMappingURL=physics.js.map