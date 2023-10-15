import * as THREE from "three";

export let G = new THREE.Vector3(0,0,-0.98);

export let sphs: Physical[] = []; // managing all fruits

// should consider frame
export class Physical {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  isFixed: boolean;
  constructor(mesh: THREE.Mesh, vel: number[], isFixed: boolean){
    this.mesh = mesh;
    this.vel = new THREE.Vector3(vel[0], vel[1], vel[2]);
    this.isFixed = isFixed;
  }

  getPosFromMesh(){
    return [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z];
  }

  getVelFromMesh(){
    return [this.vel.x, this.vel.y, this.vel.z];
  }

  nextPosition(){
    this.mesh.position.add(this.vel);
    
  }

  accelerate(acc: THREE.Vector3){
    this.vel.add(acc);
  }
};

export function physics(elements: Physical[]) {
  for(let i = 0; i < elements.length; i++){
    // console.log(elements.getPosFromMesh()[0]);
    elements[i].nextPosition();
    elements[i].accelerate(G);
  }
}