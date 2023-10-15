import * as THREE from "three";

export let G = new THREE.Vector3(0, 0, -0.98);

export let sphs: Physical[] = []; // managing all fruits

export let side: number = 200;
export let height: number = 200;

let floorElasticity = 0.5;
let sideWallElasticity = 0.9;

// should consider frame
export class Physical {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  isFixed: boolean;
  radius: number;
  isCollide: boolean;
  constructor(mesh: THREE.Mesh, vel: number[], isFixed: boolean, radius: number) {
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
    } else {
      this.mesh.position.add(this.vel);
    }

  }

  accelerate(acc: THREE.Vector3) {
    this.vel.add(acc);
  }

  checkWallCollision() {
    // floor (set this -height )
    if (this.radius - this.mesh.position.z > height) {
      // simple solution, no fast moving friends
      this.isCollide = true;
      this.mesh.position.x += this.vel.x;
      this.mesh.position.y += this.vel.y;
      this.mesh.position.z += (this.vel.z - (this.mesh.position.z - this.radius + height)) * floorElasticity; // check if this is right...
    }
    // side walls (set them at \pm side)
    if (this.mesh.position.x + this.radius > side || this.radius - this.mesh.position.x > side) { // apply if above works
      this.vel.x = -this.vel.x * sideWallElasticity;
    }
    if (this.mesh.position.y + this.radius > side || this.radius - this.mesh.position.y > side) { // apply if above works...
      this.vel.y = -this.vel.y * sideWallElasticity;
    }
    // above code should be revised not to tunnel thru wall.
    // If I precalculate here, what about nextPosition()...? OK i use flag.
  }

  checkCollisionWith(x: Physical) {
    if ( this.radius + x.radius > this.mesh.position.distanceTo(x.mesh.position)){
      // MATH...!!! 😢
      // Use below variables... It seems complicated. 
      this.vel;
      x.vel;
      this.mesh.position;
      x.mesh.position;
    }
  }
};

export function physics(elements: Physical[]) {
  for (let i = 0; i < elements.length; i++) {

    // Collision with side wall and floor might be treated as special case?? it only cost O(N).
    elements[i].checkWallCollision();
    let someGroupThatPossiblyCollideWith: Physical[] = [elements[1]];    // This line should be elaborated later...!!! el[1] is used as dummy.
    someGroupThatPossiblyCollideWith.forEach((x: Physical) => {
      elements[i].checkCollisionWith(x);
    });

    // After all are done move to next position.
    elements[i].nextPosition();
    elements[i].accelerate(G);
  }
}