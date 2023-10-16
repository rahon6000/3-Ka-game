import * as THREE from "three";
let gravity = 0.098; // At what framerate? 120?
export let G = new THREE.Vector3(0, 0, -gravity);

export let sphs: Physical[] = []; // managing all fruits

export let side: number = 100;
export let height: number = 300;
let halfHeight = height* 0.5;

let floorElasticity = 0.48;
let sideWallElasticity = 0.9;

let stillness = 4 * gravity;

let tmp = new THREE.Vector3();
// should consider frame
export class Physical {
  mass: number;
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
    this.mass = 1;
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
      this.accelerate(G);
    }

  }

  accelerate(acc: THREE.Vector3) {
    this.vel.add(acc);
  }

  checkWallCollision() {
    // floor (set this -height )
    if (this.radius - (this.mesh.position.z + this.vel.z) > halfHeight) {
      // simple solution, no fast moving friends
      this.isCollide = true;
      this.mesh.position.x += this.vel.x;
      this.mesh.position.y += this.vel.y;
      if(this.vel.length() < stillness){
        this.vel.z = 0;
        this.mesh.position.z = this.radius - halfHeight;
      } else {
        this.vel.z = -this.vel.z * floorElasticity;
        this.mesh.position.z += this.vel.z - (this.mesh.position.z - this.radius + halfHeight) * floorElasticity;
      }
    }
    // side walls (set them at \pm side)
    let nextXpos = this.mesh.position.x + this.vel.x;
    if ( nextXpos + this.radius > side || this.radius - nextXpos > side) { // apply if above works
      this.isCollide = true;
      this.vel.x = -this.vel.x * sideWallElasticity;
    }
    let nextYpos = this.mesh.position.y + this.vel.y;
    if (nextYpos + this.radius > side || this.radius - nextYpos > side) { // apply if above works...
      this.isCollide = true;
      this.vel.y = -this.vel.y * sideWallElasticity;
    }
    // above code should be revised not to tunnel thru wall.
    // If I precalculate here, what about nextPosition()...? OK i use flag.
  }

  checkCollisionWith(x: Physical) {
    let objA = this.mesh.position.clone();
    let objB = x.mesh.position.clone();
    if ( this.radius + x.radius > (objA.add(this.vel)).distanceTo(objB.add(x.vel))){
      if( this.radius === x.radius) {
        // this.sphereFusion(x);
        // return;
      }
      // MATH...!!! 😢
      // Use below variables... It seems complicated. 
      this.vel;
      x.vel;
      this.mesh.position;
      x.mesh.position;
      let lineV = objA.sub(objB).normalize();
      let normalVelA = this.vel.clone().projectOnVector(lineV.negate());
      let normalVelB = x.vel.clone().projectOnVector(lineV);
      let amplA = normalVelA.dot(lineV);
      let amplB = normalVelB.dot(lineV);
      let massSum = this.mass + x.mass;
      this.vel = lineV.clone().multiplyScalar( (amplA * (this.mass - x.mass) + amplB * ( 2 * x.mass)) / massSum );
      x.vel = lineV.clone().multiplyScalar( (amplA * ( 2 * this.mass) + amplB * ( x.mass - this.mass )) / massSum );
      this.mesh.position.add(this.vel);
      x.mesh.position.add(x.vel);
    }
  }

  sphereFusion(sph: Physical) {
    console.log("same sphs touched!");
  }
};

export function physics(elements: Physical[]) {
  for (let i = 0; i < elements.length; i++) {

    // Collision with side wall and floor might be treated as special case?? it only cost O(N).
    elements[i].checkWallCollision();
    
    // spheres 사라지는 경우 주의...
    for (let j = 0; j < elements.length; j++){
      if(i === j) continue;
      elements[i].checkCollisionWith(elements[j]);
    }

    // let someGroupThatPossiblyCollideWith: Physical[] = [elements[1]];    // This line should be elaborated later...!!! el[1] is used as dummy.
    // someGroupThatPossiblyCollideWith.forEach((x: Physical) => {
    //   elements[i].checkCollisionWith(x);
    // });

    // After all are done move to next position.
    elements[i].nextPosition(); // and also accelerate.
  }
}
