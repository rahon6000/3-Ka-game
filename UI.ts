import {
  camera,
  scene,
  renderer,
  createSph
} from './script.js';
import {sphs} from './physics.js';

let mouseX = 0, mouseY = 0, clickX = 0, clickY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

export function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  // 창 크기 변환시 camera 를 업데이트 한다.
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(500, 500);

  // renderer.setSize(window.innerWidth, window.innerHeight);

}

export function onDocumentMouseMove(event: MouseEvent) {

  mouseX = (event.clientX - windowHalfX);
  mouseY = -(event.clientY - windowHalfY);
}

export function onDocumentClick(event: MouseEvent) {
  clickX = (event.clientX - windowHalfX);
  clickY = -(event.clientY - windowHalfY);
  let newMesh = createSph(Math.random() * 20 + 1, 'test', [clickX, clickY, 0], [0, 0, 0]);
  scene.add(newMesh);

}

// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 

export function debugging(debTab: HTMLCollectionOf<Element>) {
  try {
    debTab.item(0)!.innerHTML = "(" + mouseX + ", " + mouseY + ")";
    debTab.item(1)!.innerHTML = "(" + windowHalfX + ", " + windowHalfY + ")";
    debTab.item(2)!.innerHTML = "(" + Math.round(camera.position.x) + ", " + Math.round(camera.position.y) + ")";
    // @ts-ignore
    debTab.item(3)!.innerHTML = "(" + sphs.length + ")";
    let pos = sphs[0].getPosFromMesh();
    // @ts-ignore
    debTab.item(4)!.innerHTML = "(" + Math.round(pos[0]) + "," +
      Math.round(pos[1]) + ","+
      Math.round(pos[2]) + ")";
    let vel = sphs[0].getVelFromMesh();
    // @ts-ignore
    debTab.item(5)!.innerHTML = "(" + Math.round(vel[0]) + "," +
    Math.round(vel[1]) + ","+
    Math.round(vel[2]) + ")";
  } catch (error) {
    
  }
}
export let getAngle: number = 0;
export function onCamDebugChanged(event: Event){
  // @ts-ignore
  camera.position.x = event.currentTarget!.camX.value; 
  // @ts-ignore
  camera.position.y = event.currentTarget!.camY.value;
  // @ts-ignore
  getAngle = event.currentTarget!.camTh.value;
  
}

