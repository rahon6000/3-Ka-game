var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { camera, scene, createSph, fps } from './script.js';
import { sphs, height } from './physics.js';
import { MathUtils, Vector3 } from 'three';
let mouseX = 0, mouseY = 0, clickX = 0, clickY = 0;
let cameraX = 0, cameraY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let currentPhi = 0, targetPhi = 0;
let currentTheta = 0.25 * Math.PI, targetTheta = 0.25 * Math.PI;
let currentRadi = 900, targetRadi = 900;
let transitionTime = 500;
let noKeyInput = false;
// export let cameraPhi:number = 0;
// export let cameraTheta:number = Math.PI * 0.25;
// export let cameraR:number = 900 * 1.4;
export function onWindowResize() {
    // windowHalfX = window.innerWidth / 2;
    // windowHalfY = window.innerHeight / 2;
    // // 창 크기 변환시 camera 를 업데이트 한다.
    // camera.aspect = window.innerWidth / window.innerHeight;
    // camera.updateProjectionMatrix();
    // renderer.setSize(500, 500);
    // renderer.setSize(window.innerWidth, window.innerHeight);
}
export function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = -(event.clientY - windowHalfY);
}
export function onDocumentClick(event) {
    clickX = (event.clientX - windowHalfX);
    clickY = -(event.clientY - windowHalfY);
    let newMesh = createSph(Math.random() * 20 + 1, 'test', [clickX, clickY, 0.5 * height], [Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, 0]); // This might not be random.
    scene.add(newMesh);
}
export function onKeydown(event) {
    let inputKey = event.key;
    if (currentPhi >= 7)
        currentPhi = 0;
    if (noKeyInput)
        return;
    switch (inputKey.toUpperCase()) {
        case 'Q':
            targetPhi = currentPhi - 0.5 * Math.PI;
            break;
        case 'E':
            targetPhi = currentPhi + 0.5 * Math.PI;
            break;
        case 'Z':
            targetRadi = currentRadi - 10;
            break;
        default:
            break;
    }
    noKeyInput = true;
    setTimeout(() => { noKeyInput = false; }, transitionTime);
    smoothCameraSet(targetPhi, targetTheta, targetRadi);
}
function setCameraStatus(Phi, Theta, Radi) {
    let xyProjection = Radi * Math.sin(Theta);
    let zAxis = new Vector3(0, 0, 1);
    let yAxis = new Vector3(0, 1, 0);
    camera.rotation.set(0, 0.5 * Math.PI - Theta, 0.5 * Math.PI);
    camera.rotateOnWorldAxis(zAxis, Phi);
    camera.position.set(xyProjection * Math.cos(Phi), xyProjection * Math.sin(Phi), Radi * Math.cos(Theta));
}
export function smoothCameraSet(Phi, Theta, Radi) {
    return __awaiter(this, void 0, void 0, function* () {
        let initTime = Date.now();
        let progressing = 0;
        let transit = setInterval(() => {
            progressing = (Date.now() - initTime) / transitionTime;
            if (progressing >= 1) {
                setCameraStatus(Phi, Theta, Radi);
                clearInterval(transit);
                currentPhi = targetPhi;
                currentRadi = targetRadi;
                currentTheta = targetTheta;
            }
            setCameraStatus(MathUtils.lerp(currentPhi, Phi, progressing), MathUtils.lerp(currentTheta, Theta, progressing), MathUtils.lerp(currentRadi, Radi, progressing));
        }, 20);
    });
}
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
// 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 디버깅 
export function debugging(debTab) {
    try {
        debTab.item(0).innerHTML = "(" + mouseX + ", " + mouseY + ")";
        debTab.item(1).innerHTML = "(" + windowHalfX + ", " + windowHalfY + ")";
        debTab.item(2).innerHTML = "(" + cameraX.toFixed() + ", " + cameraY.toFixed() + ")";
        // @ts-ignore
        debTab.item(3).innerHTML = "(" + sphs.length + ")";
        let pos = sphs[0].getPosFromMesh();
        // @ts-ignore
        debTab.item(4).innerHTML = "(" + Math.round(pos[0]) + "," +
            Math.round(pos[1]) + "," +
            Math.round(pos[2]) + ")";
        let vel = sphs[0].getVelFromMesh();
        // @ts-ignore
        debTab.item(5).innerHTML = "(" + Math.round(vel[0]) + "," +
            Math.round(vel[1]) + "," +
            Math.round(vel[2]) + ")";
        debTab.item(6).innerHTML = "(" + fps.toPrecision(3) + ")";
    }
    catch (error) {
    }
}
export let getAngle = 0;
export function onCamDebugChanged(event) {
    // @ts-ignore
    // camera.position.x = event.currentTarget!.camX.value; 
    // @ts-ignore
    // camera.position.y = event.currentTarget!.camY.value;
    // @ts-ignore
    let camDistance = event.currentTarget.camR.value;
    // @ts-ignore
    getAngle = Number(event.currentTarget.camTh.value);
    // setCameraStatus((getAngle) * Math.PI, 0.25* Math.PI, 900 * 1.4);
    setCameraStatus((getAngle) * Math.PI, 0.25 * Math.PI, camDistance);
}
//# sourceMappingURL=UI.js.map