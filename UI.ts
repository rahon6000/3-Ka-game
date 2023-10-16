import {
  camera,
  scene,
  renderer,
  createSph,
  createColorSph,
  fps
} from './script.js';
import {sphs, side, height, dropMargin} from './physics.js';
import { MathUtils, Vector3 } from 'three';

let mouseX = 0, mouseY = 0, clickX = 0, clickY = 0;
export let container = document.getElementById('container') as HTMLElement;
export let w_width = container.clientWidth;
export let w_height = container.clientHeight;
export let w_ratio = w_height / w_width;  // Not sure this is right......

let windowHalfX = container.clientWidth / 2 + container.offsetLeft;
let containerWidth = container.clientWidth / 2;
let containerHeight = container.clientHeight / 2;
let windowHalfY = container.clientHeight / 2 + container.offsetTop;
export let currentPhi = 0.25* Math.PI + 0.001, targetPhi = 0.25* Math.PI + 0.001;
export let currentTheta = 0.25* Math.PI, targetTheta = 0.25* Math.PI;
export let currentRadi = 900*1.5, targetRadi = 900*1.5;
let transitionTime = 500;
let noKeyInput = false;


export function onWindowResize() {

  // windowHalfX = window.innerWidth / 2;
  // windowHalfY = window.innerHeight / 2;

  // // 창 크기 변환시 camera 를 업데이트 한다.
  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();

  // renderer.setSize(500, 500);

  // renderer.setSize(window.innerWidth, window.innerHeight);

}

let vec = new Vector3(); // recycle
let pos = new Vector3(); // recycle
export function onDocumentMouseMove(event: MouseEvent) {

  mouseX = (event.clientX - windowHalfX);
  mouseY = -(event.clientY - windowHalfY);
  vec.set( mouseX / containerWidth, mouseY / containerHeight , 1);
  vec.unproject( camera );
  vec.sub( camera.position ).normalize();
  pos.copy( camera.position ).add( vec.multiplyScalar( (0.5 * height - camera.position.z) / vec.z ));
}

export function onDocumentClick(event: MouseEvent) {
  clickX = pos.x;
  clickY = pos.y;
  let margin = 5;
  if(clickX <= -side) clickX = -side + margin;
  else if(clickX >= side) clickX = side - margin;
  if(clickY <= -side) clickY = -side + margin;
  else if(clickY >= side) clickY = side - margin;
  // let newMesh = createSph(randomRadius(), 'test', 
  //   [clickX, clickY, 0.5 * height + dropMargin], 
  //   [Math.random()*2*Math.PI, Math.random()*2*Math.PI, 0]); // This might not be random.
  let newMesh = createColorSph( MathUtils.randInt(0,5),
    [clickX, clickY, 0.5 * height + dropMargin], 
    [Math.random()*2*Math.PI, Math.random()*2*Math.PI, 0]); // This might not be random.
  scene.add(newMesh);
}

export function onKeydown(event: KeyboardEvent) {
  let inputKey:string = event.key;
  if(currentPhi >= 7) currentPhi = 0;
  if(noKeyInput) return;
  switch (inputKey.toUpperCase()) {
    case 'Q':
      targetPhi = currentPhi - 0.25 * Math.PI;
      break;
    case 'E':
      targetPhi = currentPhi + 0.25 * Math.PI;
      break;
    case 'Z':
      targetRadi = currentRadi - 70;
      break;
    case 'C':
      targetRadi = currentRadi + 70;
      break;
    case 'W':
      targetTheta = currentTheta - 0.1 * Math.PI;
      break;
    case 'X':
      targetTheta = currentTheta + 0.1 * Math.PI;
      break;
    default:
      break;
  }
  noKeyInput = true;
  setTimeout( ()=> {noKeyInput = false;}, transitionTime);
  smoothCameraSet(targetPhi, targetTheta, targetRadi);
}

function setCameraStatus(Phi:number, Theta:number, Radi:number) { // 더 간단하게 짤 수 있을텐데
  let xyProjection = Radi * Math.sin(Theta);
  let zAxis = new Vector3(0,0,1);
  let yAxis = new Vector3(0,1,0);
  camera.rotation.set(0, Theta ,0.5 * Math.PI); // 😢
  camera.rotateOnWorldAxis(zAxis, Phi);
  camera.position.set(xyProjection * Math.cos(Phi),
                      xyProjection * Math.sin(Phi),
                      Radi * Math.cos(Theta));
}

export async function smoothCameraSet(Phi:number, Theta:number, Radi:number) {
  let initTime = Date.now();
  let progressing = 0;
  let transit = setInterval(()=>{
    progressing = (Date.now() - initTime) / transitionTime;
    if(progressing >= 1) {
      setCameraStatus(Phi, Theta, Radi);
      clearInterval(transit);
      currentPhi = targetPhi; currentRadi = targetRadi; currentTheta = targetTheta;
    }
    setCameraStatus(MathUtils.lerp(currentPhi, Phi, progressing),
                    MathUtils.lerp(currentTheta, Theta, progressing),
                    MathUtils.lerp(currentRadi, Radi, progressing));
  },20);
}

// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 

export function debugging(debTab: HTMLCollectionOf<Element>) {
  try {
    debTab.item(0)!.innerHTML = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
    debTab.item(1)!.innerHTML = "(" + windowHalfX + ", " + windowHalfY + ")";
    debTab.item(2)!.innerHTML = "(" + camera.position.x.toFixed() + ", " + camera.position.y.toFixed() + ")";
    // @ts-ignore
    debTab.item(3)!.innerHTML = "(" + sphs.length + ")";
    let position = sphs[0].getPosFromMesh();
    // @ts-ignore
    debTab.item(4)!.innerHTML = "(" + Math.round(position[0]) + "," +
      Math.round(position[1]) + ","+
      Math.round(position[2]) + ")";
    let vel = sphs[0].getVelFromMesh();
    // @ts-ignore
    debTab.item(5)!.innerHTML = "(" + Math.round(vel[0]) + "," +
    Math.round(vel[1]) + ","+
    Math.round(vel[2]) + ")";
    debTab.item(6)!.innerHTML = "(" + fps.toPrecision(3) + ")";
  } catch (error) {
    
  }
}
export let getAngle: number = 0;
export function onCamDebugChanged(event: Event){
  // @ts-ignore
  let camDistance = event.currentTarget!.camR.value;
  // @ts-ignore
  getAngle =  Number(event.currentTarget!.camTh.value);
  // setCameraStatus((getAngle) * Math.PI, 0.25* Math.PI, 900 * 1.4);
  setCameraStatus((getAngle) * Math.PI, 0.25 * Math.PI, camDistance );
}

function randomRadius(): number { // radius should be less than entry margin...
  let rnd = Math.random();
  if (rnd < 0.3) {
    return 15;
  } else if (rnd < 0.5) {
    return 20;
  } else if (rnd < 0.7) {
    return 25;
  } else {
    return 30;
  }
}

