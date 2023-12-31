var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as THREE from 'three';
import * as PHYS from './physics.js';
import * as UI from './UI.js';
// three.js components
export let camera;
export let scene;
export let renderer;
// For future needs
export let fps = 0;
let then;
let now;
// guideLine mesh, Maybe it sould be moved to UI.ts?
export let guideLine;
export let guideSphere;
let debTab = document.getElementsByClassName("debTab");
export let config;
let loadedTextures = [];
// to get mode selection.
let url = new URL(window.location.href);
loadConfig(url.searchParams.get("mode")).then(() => {
    init();
    animate();
});
function init() {
    var _a;
    let container = UI.container;
    // camera = new THREE.OrthographicCamera();
    camera = new THREE.PerspectiveCamera(20, UI.w_width / UI.w_height, 1, 10000);
    UI.smoothCameraSet(UI.currentPhi, UI.currentTheta, UI.currentRadi);
    // Initialize three.js scene.
    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");
    // Add lights to the scene
    // const light = new THREE.AmbientLight(0xffffff, 0.5);
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(900, 900, 1800);
    scene.add(light);
    const ambLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambLight);
    // const rectLight = new THREE.RectAreaLight(0xffffff, 2.5, 300, 300);
    // scene.add(rectLight);
    // Add fruit box (boundary) to the scene
    let border = createBorder(PHYS.side, PHYS.height, scene);
    // Add guideLine to the scene
    createGuide();
    createGuideSph();
    // Initialize renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, precision: "highp" });
    UI.onWindowResize(); // Let UI.ts do that.
    // Add canvas DOM
    container.appendChild(renderer.domElement);
    // Add input listeners
    let isMobile = detectMobileDevice(window.navigator.userAgent);
    if (isMobile) {
        document.addEventListener('touchstart', UI.onDocumentTouchStart);
        document.addEventListener('touchmove', UI.onDocumentSwipe);
        document.addEventListener('touchend', UI.onDocumentTouched);
    }
    else {
        document.addEventListener('mousemove', UI.onDocumentMouseMove);
        document.addEventListener('mouseup', UI.onDocumentMouseUp);
        document.addEventListener('mousedown', UI.onDocumentClick);
        window.addEventListener('keydown', UI.onKeydown);
    }
    window.addEventListener('resize', UI.onWindowResize);
    // Debug UI
    (_a = document.getElementById("camPos")) === null || _a === void 0 ? void 0 : _a.addEventListener('input', UI.onCamDebugChanged);
}
export function createColorSph(rank, position, rotation) {
    // Create spheres
    let radius = config[rank].radius;
    let myGeo = new THREE.SphereGeometry(radius, 32, 16);
    let texture = loadedTextures[rank];
    let material = new THREE.MeshToonMaterial({
        opacity: 1,
        transparent: true,
        map: texture,
    });
    // Create mesh from Geometry & Material. ADD TO THE SCENE!
    let mesh = new THREE.Mesh(myGeo, material);
    let acceptRange = PHYS.side - radius * 0.51;
    if (position[0] < -acceptRange)
        position[0] = -acceptRange;
    else if (position[0] > acceptRange)
        position[0] = acceptRange;
    if (position[1] < -acceptRange)
        position[1] = -acceptRange;
    else if (position[1] > acceptRange)
        position[1] = acceptRange;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    // Consider it physical object.
    const physicalElem = new PHYS.Physical(mesh, [0, 0, 0], rank, radius);
    PHYS.sphs.push(physicalElem);
    scene.add(mesh);
}
export function rankUpSph(sph) {
    let newRank = sph.rank + 1;
    if (newRank > 10) {
        killSph(sph);
        return;
    }
    let radius = config[newRank].radius;
    let myGeo = new THREE.SphereGeometry(radius, 32, 16);
    let texture = loadedTextures[newRank];
    let material = new THREE.MeshToonMaterial({
        map: texture,
    });
    sph.mesh.geometry = myGeo;
    sph.mesh.material = material;
    sph.radius = radius;
    sph.rank = newRank;
}
export function killSph(sph) {
    sph.vel.multiplyScalar(0);
    sph.isReservedToDestroyed = true;
    sph.isCollide = true;
    sph.isEverCollide = false;
    scene.remove(sph.mesh);
}
function createBorder(side, height, scene) {
    let thickness = 10;
    let opacity = 0.15;
    let myGeo = new THREE.BoxGeometry(2 * (side + thickness), 2 * (side + thickness), thickness, 1, 1, 1);
    let material = new THREE.MeshBasicMaterial({
        opacity: opacity,
        transparent: true,
        color: new THREE.Color("teal"),
    });
    let mesh = new THREE.Mesh(myGeo, material);
    mesh.position.set(0, 0, (-0.5 * (thickness + height)));
    scene.add(mesh);
    let distance = (side + 0.5 * thickness);
    let sideArray = [[0, distance],
        [0, -distance],
        [distance, 0],
        [-distance, 0]];
    let aspectArray = [[2 * (side + thickness), height],
        [2 * (side + thickness), height],
        [height, 2 * (side + thickness)],
        [height, 2 * (side + thickness)]];
    let rotaionArray = [new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 1, 0)];
    for (let i = 0; i < 4; i++) {
        let myGeo1 = new THREE.BoxGeometry(aspectArray[i][0], aspectArray[i][1], thickness, 1, 1, 1);
        let material1 = new THREE.MeshBasicMaterial({
            opacity: opacity,
            transparent: true,
            depthWrite: false,
            color: new THREE.Color("white")
        });
        let mesh1 = new THREE.Mesh(myGeo1, material1);
        mesh1.rotateOnWorldAxis(rotaionArray[i], 0.5 * Math.PI);
        mesh1.position.set(sideArray[i][0], sideArray[i][1], 0);
        scene.add(mesh1);
    }
    // Note that it is not considered as physcial object.
}
function createGuide() {
    let myGeo = new THREE.CylinderGeometry(1, 1, PHYS.height, 5, 1, true);
    let myMaterial = new THREE.MeshBasicMaterial({ opacity: 0.3, transparent: true, color: "white" });
    guideLine = new THREE.Mesh(myGeo, myMaterial);
    guideLine.position.set(0, 0, 0);
    guideLine.rotateX(Math.PI * 0.5);
    scene.add(guideLine);
    // Note that it is not considered as physcial object.
}
function createGuideSph() {
    let radius = config[UI.currentRank].radius;
    let myGeo = new THREE.SphereGeometry(radius, 32, 16);
    let texture = loadedTextures[UI.currentRank];
    let material = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true,
        depthWrite: false,
        map: texture
    });
    guideSphere = new THREE.Mesh(myGeo, material);
    guideSphere.position.set(0, 0, 1000);
    guideSphere.rotation.set(0, 0, 0);
    scene.add(guideSphere);
    // Note that it is not considered as physcial object.
}
export function renewGuideSphere() {
    guideSphere.clear();
    let radius = config[UI.currentRank].radius;
    let myGeo = new THREE.SphereGeometry(radius, 32, 16);
    let texture = loadedTextures[UI.currentRank];
    let material = new THREE.MeshBasicMaterial({
        opacity: 0.5,
        transparent: true,
        depthWrite: false,
        map: texture
    });
    guideSphere.geometry = myGeo;
    guideSphere.material = material;
}
// render each frame.
function animate() {
    requestAnimationFrame(animate);
    render();
    // stats.update();
    now = Date.now();
    fps = 1000 / (now - then);
    then = now;
}
// Physcis, UI, render.
function render() {
    PHYS.physics(PHYS.sphs);
    UI.display();
    UI.debugging(debTab);
    renderer.render(scene, camera);
}
// Game over execution.
export function gameOver() {
    PHYS.sphs.splice(0, PHYS.sphs.length);
    document.removeEventListener('touchstart', UI.onDocumentTouchStart);
    document.removeEventListener('touchend', UI.onDocumentTouched);
    document.removeEventListener('mousemove', UI.onDocumentMouseMove);
    document.removeEventListener('click', UI.onDocumentClick);
    scene.remove(guideLine);
    scene.remove(guideSphere);
    alert("game over.");
}
// loading config json.
function loadConfig(mode) {
    return __awaiter(this, void 0, void 0, function* () {
        let fet = yield fetch("app_config.json");
        let waiter = fet.json().then((body) => {
            if (mode === "DEFAULT" || mode === null) {
                config = body.DEFAULT;
                for (let i = 0; i < config.length; i++) {
                    loadedTextures.push(new THREE.TextureLoader().load('textures/' + "DEFAULT/" + config[i].texture + '.png'));
                }
            }
            else if (mode === "BLUEARCHIVE") {
                config = body.BLUEARCHIVE;
                for (let i = 0; i < config.length; i++) {
                    loadedTextures.push(new THREE.TextureLoader().load("textures/BLUEARCHIVE/" + config[i].texture + '.png'));
                }
            }
            else {
                config = body.DEFAULT;
                for (let i = 0; i < config.length; i++) {
                    loadedTextures.push(new THREE.TextureLoader().load('textures/' + "DEFAULT/" + config[i].texture + '.png'));
                }
            }
            PHYS.setPhysicalParameters(body.PHYSICS.floorElasticity, body.PHYSICS.sideWallElasticity, body.PHYSICS.interSphereElasticity, body.PHYSICS.sphereFriction, body.PHYSICS.stillness, body.PHYSICS.wallOverwrapCoeff, body.PHYSICS.overwrapRepulsion);
            return 0;
        }, (reject) => console.log(reject.message));
        return waiter;
    });
}
function detectMobileDevice(agent) {
    let mobileRegex = [
        /Android/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Window Phone/i
    ];
    return mobileRegex.some(reg => agent.match(reg));
}
//# sourceMappingURL=script.js.map