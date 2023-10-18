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
// import Stats from 'three/addons/libs/stats.module.js';
let container; //, stats;
container = document.getElementById('container');
export let camera;
export let scene;
export let renderer;
export let fps = 0;
let then;
let now;
export let guideLine;
export let guideSphere;
const zAxis = new THREE.Vector3(0, 0, 1);
let debTab = document.getElementsByClassName("debTab");
// 🍉 Sphere configuration 🍉 (should be saved in .json, not hard-coded.)
export let config = [
    {
        radius: 10,
        mass: 1,
        texture: "test",
        color: new THREE.Color("crimson"),
        name: "cherry"
    },
    {
        radius: 15,
        mass: 1,
        texture: "test",
        color: new THREE.Color("salmon"),
        name: "strawberry"
    },
    {
        radius: 20,
        mass: 1,
        texture: "test",
        color: new THREE.Color("slateblue"),
        name: "grape"
    },
    {
        radius: 25,
        mass: 1,
        texture: "test",
        color: new THREE.Color("orange"),
        name: "mandarin"
    },
    {
        radius: 30,
        mass: 1,
        texture: "test",
        color: new THREE.Color("orangered"),
        name: "persimmon"
    },
    {
        radius: 35,
        mass: 1,
        texture: "test",
        color: new THREE.Color("red"),
        name: "apple"
    },
    {
        radius: 40,
        mass: 1,
        texture: "test",
        color: new THREE.Color("palegoldenrod"),
        name: "pear"
    },
    {
        radius: 45,
        mass: 1,
        texture: "test",
        color: new THREE.Color("pink"),
        name: "peach"
    },
    {
        radius: 50,
        mass: 1,
        texture: "test",
        color: new THREE.Color("yellow"),
        name: "ananas or pineapple"
    },
    {
        radius: 55,
        mass: 1,
        texture: "test",
        color: new THREE.Color("chartreuse"),
        name: "melon"
    },
    {
        radius: 60,
        mass: 1,
        texture: "test",
        color: new THREE.Color("darkgreen"),
        name: "suika"
    }
];
loadConfig("default").then(() => {
    init();
    animate();
});
function init() {
    var _a;
    container = UI.container;
    // camera = new THREE.OrthographicCamera();
    camera = new THREE.PerspectiveCamera(20, UI.w_width / UI.w_height, 1, 10000);
    UI.smoothCameraSet(UI.currentPhi, UI.currentTheta, UI.currentRadi);
    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");
    const light = new THREE.AmbientLight();
    // const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0, 0, 1);
    scene.add(light);
    let border = createBorder(PHYS.side, PHYS.height, scene);
    createGuide();
    createGuideSph();
    // let mesh = createSph(2, 'test', [0, 0, 0.5 * PHYS.height], [0, 0, 0]);
    // scene.add(mesh);
    // Finally, (prepare) Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setPixelRatio(UI.w_ratio);
    // renderer.setSize(UI.w_width, UI.w_height);
    renderer.setPixelRatio(1);
    renderer.setSize(300, 500);
    UI.onWindowResize();
    container.appendChild(renderer.domElement);
    document.addEventListener('mousemove', UI.onDocumentMouseMove);
    document.addEventListener('click', UI.onDocumentClick);
    window.addEventListener('resize', UI.onWindowResize);
    window.addEventListener('keydown', UI.onKeydown);
    // Debug UI
    (_a = document.getElementById("camPos")) === null || _a === void 0 ? void 0 : _a.addEventListener('input', UI.onCamDebugChanged);
}
// Refactor sph appearance part.
// export function createSph(rank: number, textureName: string, position: number[], rotation: number[]) {
//   let radius = 20; //config[rank].radius;
//   // Create spheres
//   // const myGeo = new THREE.IcosahedronGeometry(radius, 1); // 디폴트 UV 맵이 맘에 안듬.
//   let myGeo = new THREE.SphereGeometry(radius, 32, 16);
//   let texture = new THREE.TextureLoader().load('textures/' + textureName + '.png');
//   let material = new THREE.MeshBasicMaterial({ map: texture });
//   // Create mesh from Geometry & Material. ADD TO THE SCENE!
//   let mesh = new THREE.Mesh(myGeo, material);
//   let textured = new THREE.Mesh(myGeo, material);
//   mesh.add(textured);
//   let acceptRange = PHYS.side - radius * 0.51;
//   if (position[0] < -acceptRange) position[0] = -acceptRange;
//   else if (position[0] > acceptRange) position[0] = acceptRange;
//   if (position[1] < -acceptRange) position[1] = -acceptRange;
//   else if (position[1] > acceptRange) position[1] = acceptRange;
//   mesh.position.set(position[0], position[1], position[2]); // Type of pos must be THREE.vector3
//   mesh.rotation.set(rotation[0], rotation[1], rotation[2]); // Type of rotation must be THREE.euler
//   const physicalElem = new PHYS.Physical(mesh, [0, 0, 0], rank, radius);
//   PHYS.sphs.push(physicalElem);
//   return mesh;
// }
export function createColorSph(rank, position, rotation) {
    // Create spheres
    // const myGeo = new THREE.IcosahedronGeometry(radius, 1); // 디폴트 UV 맵이 맘에 안듬.
    let radius = config[rank].radius;
    let myGeo = new THREE.SphereGeometry(radius, 32, 16);
    let textureName = config[rank].texture;
    let texture = new THREE.TextureLoader().load('textures/' + textureName + '.png');
    let material = new THREE.MeshBasicMaterial({
        opacity: 1,
        transparent: true,
        // color: config[rank].color,
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
    mesh.position.set(position[0], position[1], position[2]); // Type of pos must be THREE.vector3
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]); // Type of rotation must be THREE.euler
    const physicalElem = new PHYS.Physical(mesh, [0, 0, 0], rank, radius);
    PHYS.sphs.push(physicalElem);
    scene.add(mesh);
}
export function rankUpSph(sph) {
    let newRank = sph.rank + 1;
    let radius = config[newRank].radius;
    let myGeo = new THREE.SphereGeometry(radius, 32, 16);
    let textureName = config[newRank].texture;
    let texture = new THREE.TextureLoader().load('textures/' + textureName + '.png');
    let material = new THREE.MeshBasicMaterial({
        // color: config[newRank].color,
        map: texture,
    });
    sph.mesh.geometry = myGeo;
    sph.mesh.material = material;
    sph.radius = radius;
    sph.rank = newRank;
}
function createBorder(side, height, scene) {
    let thickness = 10;
    let opacity = 0.2;
    let myGeo = new THREE.BoxGeometry(2 * side, 2 * side, thickness, 1, 1, 1);
    let material = new THREE.MeshBasicMaterial({
        opacity: opacity,
        transparent: true,
        color: new THREE.Color("teal")
    });
    let mesh = new THREE.Mesh(myGeo, material);
    mesh.position.set(0, 0, (-0.5 * (thickness + height)));
    scene.add(mesh);
    let distance = (side - thickness * 0.5);
    let sideArray = [[0, distance],
        [0, -distance],
        [distance, 0],
        [-distance, 0]];
    let aspectArray = [[2 * (side), height],
        [2 * (side), height],
        [height, 2 * (side)],
        [height, 2 * (side)]];
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
        // 충돌 따로 하드코딩 해서 구현
        mesh1.position.set(sideArray[i][0], sideArray[i][1], 0);
        scene.add(mesh1);
    }
}
function createGuide() {
    let myGeo = new THREE.CylinderGeometry(1, 1, PHYS.height, 5, 1, true);
    let myMaterial = new THREE.MeshBasicMaterial({ opacity: 0.3, transparent: true, color: "white" });
    guideLine = new THREE.Mesh(myGeo, myMaterial);
    guideLine.position.set(0, 0, 0);
    guideLine.rotateX(Math.PI * 0.5);
    scene.add(guideLine);
}
function createGuideSph() {
    let radius = config[UI.currentRank].radius;
    let myGeo = new THREE.SphereGeometry(radius, 32, 16);
    // let texture = new THREE.TextureLoader().load('textures/' + textureName + '.png');
    let textureName = config[UI.currentRank].texture;
    let texture = new THREE.TextureLoader().load('textures/' + textureName + '.png');
    let material = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true,
        depthWrite: false,
        // color: config[UI.currentRank].color,
        map: texture
    });
    // Create mesh from Geometry & Material. ADD TO THE SCENE!
    // let mesh = new THREE.Mesh(myGeo, material); // this caused error.
    guideSphere = new THREE.Mesh(myGeo, material);
    let textured = new THREE.Mesh(myGeo, material);
    guideSphere.add(textured);
    guideSphere.position.set(0, 0, 1000); // Type of pos must be THREE.vector3
    guideSphere.rotation.set(0, 0, 0); // Type of rotation must be THREE.euler
    scene.add(guideSphere);
}
export function renewGuideSphere() {
    guideSphere.clear();
    let radius = config[UI.currentRank].radius;
    let myGeo = new THREE.SphereGeometry(radius, 32, 16); // new geo
    let textureName = config[UI.currentRank].texture;
    let texture = new THREE.TextureLoader().load('textures/' + textureName + '.png');
    let material = new THREE.MeshBasicMaterial({
        opacity: 0.5,
        transparent: true,
        depthWrite: false,
        // color: config[UI.currentRank].color,
        map: texture
    });
    guideSphere.geometry = myGeo;
    guideSphere.material = material;
}
// 얘가 한번만이 아닌 계속 작동하는 원리는 뭐야?
function animate() {
    requestAnimationFrame(animate);
    render();
    // stats.update();
    now = Date.now();
    fps = 1000 / (now - then);
    then = now;
}
// scene is referred at ACTUAL render function.
function render() {
    PHYS.physics(PHYS.sphs);
    UI.display();
    UI.debugging(debTab);
    renderer.render(scene, camera); // OF COURSE we use prepared renderer.
}
export function gameOver() {
    PHYS.sphs.splice(0, PHYS.sphs.length);
    alert("game over.");
}
function loadConfig(mode) {
    return __awaiter(this, void 0, void 0, function* () {
        let fet = yield fetch("app_config.json");
        let waiter = fet.json().then((body) => {
            config = body.DEFAULT;
            return 0;
        });
        return waiter;
    });
}
//# sourceMappingURL=script.js.map