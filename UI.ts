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
  config
} from './script.js';
import { sphs, side, height, dropMargin, setPhysicalParameters} from './physics.js';
import { MathUtils, Vector3, Color } from 'three';

let mouseX = 0, mouseY = 0, clickX = 0, clickY = 0;
export let container = document.getElementById('container') as HTMLElement;
export let w_width = container.clientWidth;
export let w_height = container.clientHeight;
export let w_ratio = w_height / w_width;  // Not sure this is right......

let windowHalfX = container.clientWidth / 2 + container.offsetLeft;
let windowHalfY = container.clientHeight / 2 + container.offsetTop;
let containerWidth = container.clientWidth / 2;
let containerHeight = container.clientHeight / 2;

let upNextPanel = document.getElementById('upNext') as HTMLElement;
let scoreBoard = document.getElementById('scoreBoard') as HTMLElement;

export let currentPhi = 0.25 * Math.PI + 0.001, targetPhi = 0.25 * Math.PI + 0.001;
export let currentTheta = 0.25 * Math.PI, targetTheta = 0.25 * Math.PI;
export let currentRadi = 900 * 1.5, targetRadi = 900 * 1.5;
let transitionTime = 500;
let noKeyInput = false;

export let currentRank = MathUtils.randInt(0,5);
let nextRank = MathUtils.randInt(0,5);
let gameScore: number = 0;



export function onWindowResize() {

  windowHalfX = container.clientWidth / 2 + container.offsetLeft;
  windowHalfY = container.clientHeight / 2 + container.offsetTop;
  containerWidth = container.clientWidth / 2;
  containerHeight = container.clientHeight / 2;

  // // 창 크기 변환시 camera 를 업데이트 한다.
  camera.aspect = containerWidth / containerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth , container.clientHeight );

}

let vec = new Vector3(); // recycle. normalized mouse position in camera view.
let pos = new Vector3(); // recycle. world position under the mouse.
export function onDocumentMouseMove(event: MouseEvent) {

  mouseX = (event.clientX - windowHalfX + window.scrollX);
  mouseY = -(event.clientY - windowHalfY + window.scrollY);
  vec.set(mouseX / containerWidth, mouseY / containerHeight, 1);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  pos.copy(camera.position).add(vec.multiplyScalar((0.5 * height + dropMargin - camera.position.z) / vec.z));
  if (isInRange(pos, side)) {
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
  }
}

export function onDocumentClick(event: MouseEvent) {
  if ( sphs.length > 0 && sphs[sphs.length-1].mesh.position.z > (0.5 * height)) return;
  clickX = pos.x + (Math.random()-0.5);
  clickY = pos.y + (Math.random()-0.5);
  let margin = 5;
  if (Math.abs(clickX) > (side + 50)) return;
  if (Math.abs(clickY) > (side + 50)) return;
  if (clickX <= -side) clickX = -side + margin;
  else if (clickX >= side) clickX = side - margin;
  if (clickY <= -side) clickY = -side + margin;
  else if (clickY >= side) clickY = side - margin;
  // let newMesh = createSph(randomRadius(), 'test', 
  //   [clickX, clickY, 0.5 * height + dropMargin], 
  //   [Math.random()*2*Math.PI, Math.random()*2*Math.PI, 0]); // This might not be random.
  let newMesh = createColorSph(currentRank,
    [clickX, clickY, 0.5 * height + dropMargin],
    [Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, 0]); // This might not be random.
  
  currentRank = nextRank;
  nextRank = MathUtils.randInt(0,5);
  // // renew guide sphere.
  renewGuideSphere();
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
    case 'F':

      break;
    default:
      break;
  }
  noKeyInput = true;
  setTimeout(() => { noKeyInput = false; }, transitionTime);
  smoothCameraSet(targetPhi, targetTheta, targetRadi);
}


let Xstart = 0;
let Ystart = 0;
export function onDocumentTouchStart(this: Document, ev: TouchEvent) {
  Xstart = (ev.touches[0].clientX - windowHalfX + window.scrollX);
  Ystart = -(ev.touches[0].clientY - windowHalfY + window.scrollY);

}

export function onDocumentTouched(this: Document, ev: TouchEvent) {
  let clientX = (ev.changedTouches[0].clientX - windowHalfX + window.scrollX);
  let clientY = -(ev.changedTouches[0].clientY - windowHalfY + window.scrollY);
  vec.set(clientX / containerWidth, clientY / containerHeight, 1);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  pos.copy(camera.position).add(vec.multiplyScalar((0.5 * height + dropMargin - camera.position.z) / vec.z));
  onDocumentClick( new MouseEvent("dummy") );
  //@ts-ignore
  guideLine.material.opacity = 0;
  //@ts-ignore
  guideSphere.material.opacity = 0;
}

export function onDocumentSwipe(this: Document, ev: TouchEvent) {
  
  // define pos for mobile
  mouseX = (ev.changedTouches[0].clientX - windowHalfX + window.scrollX);
  mouseY = -(ev.changedTouches[0].clientY - windowHalfY + window.scrollY);
  vec.set(mouseX / containerWidth, mouseY / containerHeight, 1);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  pos.copy(camera.position).add(vec.multiplyScalar((0.5 * height + dropMargin - camera.position.z) / vec.z));

  if (isInRange(pos, side)) {
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
  } 
  if (noKeyInput) return;
  if (Math.abs(pos.x) > (side + 50) && Math.abs(pos.x) > (side + 50)) {
    // outside the entry
    if( Math.abs(mouseX - Xstart) > w_width * 0.3) {
      // rotation for mobile
      if(mouseX - Xstart < 0) {
        targetPhi = currentPhi + 0.25 * Math.PI;
      } else {
        targetPhi = currentPhi - 0.25 * Math.PI;
      }
      noKeyInput = true;
      setTimeout(() => { noKeyInput = false; }, transitionTime);
      smoothCameraSet(targetPhi, targetTheta, targetRadi);
    }
  }
}

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

export function addGameScore( num : number){
  gameScore += num;
}

export function display(){
  upNextPanel.innerText = config[nextRank].name;//nextRank.toString();
  upNextPanel.style.color = "#" + new Color(config[nextRank].color).getHexString();
  // upNextPanel.style.fontSize = config[nextRank].radius.toString()+"px";
  scoreBoard.innerText = gameScore.toString();
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
function isInRange(pos: Vector3, side: number):boolean {
  return (pos.x < side) && (pos.x > -side) && (pos.y < side) && (pos.y > -side);
}
