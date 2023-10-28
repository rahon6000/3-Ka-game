import {
  camera,
  scene,
  renderer,
  // createSph,
  createColorSph,
  guideLine,
  guideSphere,
  renewGuideSphere,
  fps,
  config,
} from './script.js';

import { sphs, 
  side, 
  height, 
  setPhysicalParameters
} from './physics.js';

import { MathUtils, 
  Vector3, 
  Color 
} from 'three';

let mouseX = 0, mouseY = 0, clickX = 0, clickY = 0; // Client mouse positions
export let container = document.getElementById('container') as HTMLElement; // container DOM
export let w_width = container.clientWidth;
export let w_height = container.clientHeight;
export let w_ratio = w_height / w_width;
let windowHalfX = container.clientWidth / 2 + container.offsetLeft;
let windowHalfY = container.clientHeight / 2 + container.offsetTop;
let containerWidth = container.clientWidth / 2;
let containerHeight = container.clientHeight / 2;
let upNextPanel = document.getElementById('upNext') as HTMLElement; // Other UI panels DOM
let scoreBoard = document.getElementById('scoreBoard') as HTMLElement;

// Camera orientations and movement
export let currentPhi = 0.25 * Math.PI + 0.001, targetPhi = 0.25 * Math.PI + 0.001;
export let currentTheta = 0.25 * Math.PI, targetTheta = 0.25 * Math.PI;
export let currentRadi = 900 * 1.5, targetRadi = 900 * 1.5;
let transitionTime = 300;
let noKeyInput = false;
let isButtonDown = false;

// Fruit rank (is it OK to be here...?) and game score.
export let currentRank = MathUtils.randInt(0,5);
let nextRank = MathUtils.randInt(0,5);
let dropMargin: number = 48;
let gameScore: number = 0;

// Vectors used to map from client -> 3D world.
let vec = new Vector3(); // recycle. normalized mouse position in camera view.
let pos = new Vector3(); // recycle. world position under the mouse.

// numbers for Mobile UIs
let touchXstart = 0;
let touchYstart = 0;

export function onWindowResize() {
  windowHalfX = container.clientWidth / 2 + container.offsetLeft;
  windowHalfY = container.clientHeight / 2 + container.offsetTop;
  containerWidth = container.clientWidth / 2;
  containerHeight = container.clientHeight / 2;

  // // Update cam
  camera.aspect = containerWidth / containerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth , container.clientHeight );

  dropMargin = config[4].radius+1;
}

// PC mouse UIs
let mouseMoveX;
let mouseMoveY;
export function onDocumentMouseMove(event: MouseEvent) {
  mouseMoveX = (event.clientX - windowHalfX + window.scrollX);
  mouseMoveY = -(event.clientY - windowHalfY + window.scrollY);
  vec.set(mouseMoveX / containerWidth, mouseMoveY / containerHeight, 1);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  pos.copy(camera.position).add(vec.multiplyScalar((0.5 * height + dropMargin - camera.position.z) / vec.z));
  if (isInRange(pos, side + 50)) {
    let margin = config[currentRank].radius * 0.75;
    if (pos.x <= -side + margin) pos.x = -side +margin;
    else if (pos.x >= side - margin) pos.x = side - margin;
    if (pos.y <= -side + margin) pos.y = -side + margin;
    else if (pos.y >= side - margin) pos.y = side - margin;
    //@ts-ignore
    guideLine.material.opacity = 0.5;
    guideLine.position.set(pos.x, pos.y, 0);
    guideSphere.position.set(pos.x, pos.y, 0.5 * height +dropMargin);
    //@ts-ignore
    guideSphere.material.opacity = 0.5;
  } else {
    //@ts-ignore
    guideLine.material.opacity = 0;
    //@ts-ignore
    guideSphere.material.opacity = 0;
    // CameraSetting
    if(isButtonDown){
      targetPhi = currentPhi + (mouseX - mouseMoveX) * 0.001 * Math.PI;
      targetTheta = currentTheta + (mouseMoveY - mouseY) * 0.001 * Math.PI;
      if ( targetTheta > 0.5 * Math.PI) targetTheta = 0.5 * Math.PI;
      else if ( targetTheta < 0) targetTheta = 0;
      setCameraStatus(targetPhi, targetTheta, targetRadi);
      mouseX = mouseMoveX;
      mouseY = mouseMoveY;
      currentPhi = targetPhi;
      currentTheta = targetTheta;
      
    }
  }
}

export function onDocumentClick(event: MouseEvent) {
  isButtonDown = true;
  // mouseX = (event.clientX - windowHalfX + window.scrollX);
  // mouseY = -(event.clientY - windowHalfY + window.scrollY);
  // vec.set(mouseX / containerWidth, mouseY / containerHeight, 1);
  // vec.unproject(camera);
  // vec.sub(camera.position).normalize();
  // pos.copy(camera.position).add(vec.multiplyScalar((0.5 * height + dropMargin - camera.position.z) / vec.z));
  if ( sphs.length > 0 && 
    sphs[sphs.length-1].mesh.position.z > (0.5 * height) - (sphs[sphs.length-1].radius + config[currentRank].radius) &&
    !sphs[sphs.length-1].isEverCollide) {
      return;
  }
  clickX = pos.x + (Math.random()-0.5);
  clickY = pos.y + (Math.random()-0.5);
  if (Math.abs(clickX) > (side + 50)) return;
  if (Math.abs(clickY) > (side + 50)) return;
  let margin = config[currentRank].radius * 0.75;
  if (clickX <= -side + margin) clickX = -side + margin;
  else if (clickX >= side - margin) clickX = side - margin;
  if (clickY <= -side + margin) clickY = -side + margin;
  else if (clickY >= side - margin) clickY = side - margin;
  createColorSph(currentRank,
    [clickX, clickY, 0.5 * height + dropMargin],
    [Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, 0]); // This might not be random.
  
  currentRank = nextRank;
  nextRank = MathUtils.randInt(0,5);
  // // renew guide sphere.
  renewGuideSphere();
}

export function onDocumentMouseUp(event: MouseEvent){
  console.log("up");
  isButtonDown = false;
}

export function onKeydown(event: KeyboardEvent) {
  let inputKey: string = event.key;
  if (currentPhi >= 7) currentPhi = 0;
  if (noKeyInput) return;
  switch (inputKey.toUpperCase()) {
    case 'Q':
      targetPhi = currentPhi - 0.25 * Math.PI;
      break;
    case 'E':
      targetPhi = currentPhi + 0.25 * Math.PI;
      break;
    case 'Z':
      targetRadi = currentRadi - 80;
      break;
    case 'C':
      targetRadi = currentRadi + 80;
      break;
    case 'W':
      targetTheta = currentTheta - 0.1 * Math.PI;
      break;
    case 'X':
      targetTheta = currentTheta + 0.1 * Math.PI;
      break;
    case 'F':

      break;
    default:
      break;
  }
  noKeyInput = true;
  if (targetTheta < 0 ) targetTheta = 0;
  if (targetTheta > 0.5 * Math.PI ) targetTheta = 0.5 * Math.PI;
  if (targetRadi < 100) targetRadi = 100;
  setTimeout(() => { noKeyInput = false; }, transitionTime);
  smoothCameraSet(targetPhi, targetTheta, targetRadi);
}

// Mobile UIs
export function onDocumentTouchStart(this: Document, ev: TouchEvent) {
  touchXstart = (ev.touches[0].clientX - windowHalfX + window.scrollX);
  touchYstart = -(ev.touches[0].clientY - windowHalfY + window.scrollY);
}

export function onDocumentTouched(this: Document, ev: TouchEvent) { // finger off from screen
  let clientX = (ev.changedTouches[0].clientX - windowHalfX + window.scrollX);
  let clientY = -(ev.changedTouches[0].clientY - windowHalfY + window.scrollY);
  vec.set(clientX / containerWidth, clientY / containerHeight, 1);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  pos.copy(camera.position).add(vec.multiplyScalar((0.5 * height + dropMargin - camera.position.z) / vec.z));
  onDocumentClick( new MouseEvent("dummy") ); // reuse PC version.
  //@ts-ignore
  guideLine.material.opacity = 0;
  //@ts-ignore
  guideSphere.material.opacity = 0;
}

export function onDocumentSwipe(this: Document, ev: TouchEvent) { // finger still in touch.
  mouseX = (ev.changedTouches[0].clientX - windowHalfX + window.scrollX);
  mouseY = -(ev.changedTouches[0].clientY - windowHalfY + window.scrollY);
  vec.set(mouseX / containerWidth, mouseY / containerHeight, 1);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  pos.copy(camera.position).add(vec.multiplyScalar((0.5 * height + dropMargin - camera.position.z) / vec.z));

  if (isInRange(pos, side + 50)) {
    let margin = config[currentRank].radius * 0.75;
    if (pos.x <= -side + margin) pos.x = -side + +margin;
    else if (pos.x >= side - margin) pos.x = side - margin;
    if (pos.y <= -side + margin) pos.y = -side + margin;
    else if (pos.y >= side - margin) pos.y = side - margin;
    //@ts-ignore
    guideLine.material.opacity = 0.5;
    guideLine.position.set(pos.x, pos.y, 0);
    guideSphere.position.set(pos.x, pos.y, 0.5 * height +dropMargin);
    //@ts-ignore
    guideSphere.material.opacity = 0.5;
  } else {
    targetPhi = currentPhi + (touchXstart - mouseX) * 0.001 * Math.PI;
    targetTheta = currentTheta + (mouseY - touchYstart) * 0.001 * Math.PI;
    if ( targetTheta > 0.5 * Math.PI) targetTheta = 0.5 * Math.PI;
    else if ( targetTheta < 0) targetTheta = 0;
    setCameraStatus(targetPhi, targetTheta, targetRadi);
    touchXstart = mouseX;
    touchYstart = mouseY;
    currentPhi = targetPhi;
    currentTheta = targetTheta;
  }
}

function isInRange(pos: Vector3, side: number):boolean {
  return (pos.x < side) && (pos.x > -side) && (pos.y < side) && (pos.y > -side);
}

// Set camera orientaion
function setCameraStatus(Phi: number, Theta: number, Radi: number) { // 더 간단하게 짤 수 있을텐데
  let xyProjection = Radi * Math.sin(Theta);
  let zAxis = new Vector3(0, 0, 1);
  let yAxis = new Vector3(0, 1, 0);
  camera.rotation.set(0, Theta, 0.5 * Math.PI); // 😢
  camera.rotateOnWorldAxis(zAxis, Phi);
  camera.position.set(xyProjection * Math.cos(Phi),
    xyProjection * Math.sin(Phi),
    Radi * Math.cos(Theta));
}

export async function smoothCameraSet(Phi: number, Theta: number, Radi: number) {
  let initTime = Date.now();
  let progressing = 0;
  let transit = setInterval(() => {
    progressing = (Date.now() - initTime) / transitionTime;
    if (progressing >= 1) {
      setCameraStatus(Phi, Theta, Radi);
      clearInterval(transit);
      currentPhi = targetPhi; currentRadi = targetRadi; currentTheta = targetTheta;
    }
    setCameraStatus(MathUtils.lerp(currentPhi, Phi, progressing),
      MathUtils.lerp(currentTheta, Theta, progressing),
      MathUtils.lerp(currentRadi, Radi, progressing));
  }, 20);
}

// Scoring.
export function addGameScore( num : number){
  gameScore += num;
}

// Display socre, next fruit.
export function display(){
  upNextPanel.innerText = config[nextRank].name;//nextRank.toString();
  upNextPanel.style.color = "#" + new Color(config[nextRank].color).getHexString();
  // upNextPanel.style.fontSize = config[nextRank].radius.toString()+"px";
  scoreBoard.innerText = gameScore.toString();
}


/**
 * 
 * Debugging, parameter adjust only
 */
export function debugging(debTab: HTMLCollectionOf<Element>) {
  try {
    debTab.item(0)!.innerHTML = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
    debTab.item(1)!.innerHTML = "(" + windowHalfX + ", " + windowHalfY + ")";
    debTab.item(2)!.innerHTML = "(" + camera.position.x.toFixed() + ", " + camera.position.y.toFixed() + ")";
    // @ts-ignore
    debTab.item(3)!.innerHTML = "(" + sphs.length + ")";

    if(sphs.length > 0) {
      let position = sphs[0].getPosFromMesh();
      // @ts-ignore
      debTab.item(4)!.innerHTML = "(" + Math.round(position[0]) + "," +
        Math.round(position[1]) + "," +
        Math.round(position[2]) + ")";
      let vel = sphs[0].getVelFromMesh();
      // @ts-ignore
      debTab.item(5)!.innerHTML = "(" + Math.round(vel[0]) + "," +
        Math.round(vel[1]) + "," +
        Math.round(vel[2]) + ")";
      debTab.item(6)!.innerHTML = "(" + fps.toPrecision(3) + ")";  
    }

    let sphereDisplay = "";
    for (let i = 0; i < sphs.length; i++) {
      sphereDisplay += "<tr><td>" +
        i + "</td><td>" +
        sphs[i].rank.toFixed() + "</td><td>" +
        sphs[i].radius.toFixed() + "</td><td>" +
        sphs[i].mass.toFixed() +
        "</td><tr>";
    }
    // @ts-ignore
    debTab.namedItem("spheres")?.innerHTML = sphereDisplay;

    
    // @ts-ignore
    setPhysicalParameters(
      // @ts-ignore
      Number(debTab.namedItem("floorE").value),
      // @ts-ignore
      Number(debTab.namedItem("wallE").value),
      // @ts-ignore
      Number(debTab.namedItem("spheE").value),
      // @ts-ignore
      Number(debTab.namedItem("spheF").value),
      // @ts-ignore
      Number(debTab.namedItem("still").value),
      // @ts-ignore
      Number(debTab.namedItem("wallRep").value),
      // @ts-ignore
      Number(debTab.namedItem("spheRep").value)
    ); // 옘병~
    console.log();
  } catch (error) {
    console.log(error);
  }

}
export let getAngle: number = 0;
export function onCamDebugChanged(event: Event) {
  // @ts-ignore
  let camDistance = event.currentTarget!.camR.value;
  // @ts-ignore
  getAngle = Number(event.currentTarget!.camTh.value);
  // setCameraStatus((getAngle) * Math.PI, 0.25* Math.PI, 900 * 1.4);
  setCameraStatus((getAngle) * Math.PI, 0.25 * Math.PI, camDistance);
}