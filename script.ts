import * as THREE from 'three';
import * as PHYS from './physics.js';
import * as UI from './UI.js';
// import Stats from 'three/addons/libs/stats.module.js';

let container //, stats;
container = document.getElementById('container');
export let camera: THREE.PerspectiveCamera;
export let scene: THREE.Scene;
export let renderer: THREE.WebGLRenderer;
export let fps: number = 0;
let then: number;
let now: number;

export let guideLine: THREE.Mesh;
export let guideSphere: THREE.Mesh;
const zAxis = new THREE.Vector3(0, 0, 1);

let debTab: HTMLCollectionOf<Element> = document.getElementsByClassName("debTab");

// 🍉 Sphere configuration 🍉 (should be saved in .json, not hard-coded.)
export let config = [
  { // rank 0 
    radius: 10,
    mass: 1,
    texture: "test",
    color: new THREE.Color("crimson"),
    name: "cherry"
  },
  { // rank 1
    radius: 15,
    mass: 1,
    texture: "test",
    color: new THREE.Color("salmon"),
    name: "strawberry"
  },
  { // rank 2 
    radius: 20,
    mass: 1,
    texture: "test",
    color: new THREE.Color("slateblue"),
    name: "grape"
  },
  { // rank 3 
    radius: 25,
    mass: 1,
    texture: "test",
    color: new THREE.Color("orange"),
    name: "mandarin"
  },
  { // rank 4 
    radius: 30,
    mass: 1,
    texture: "test",
    color: new THREE.Color("orangered"),
    name: "persimmon"
  },
  { // rank 5 
    radius: 35,
    mass: 1,
    texture: "test",
    color: new THREE.Color("red"),
    name: "apple"
  },
  { // rank 6
    radius: 40,
    mass: 1,
    texture: "test",
    color: new THREE.Color("palegoldenrod"),
    name: "pear"
  },
  { // rank 7 
    radius: 45,
    mass: 1,
    texture: "test",
    color: new THREE.Color("pink"),
    name: "peach"
  },
  { // rank 8
    radius: 50,
    mass: 1,
    texture: "test",
    color: new THREE.Color("yellow"),
    name: "ananas or pineapple"
  },
  { // rank 9
    radius: 55,
    mass: 1,
    texture: "test",
    color: new THREE.Color("chartreuse"),
    name: "melon"
  },
  { // rank 10 
    radius: 60,
    mass: 1,
    texture: "test",
    color: new THREE.Color("darkgreen"),
    name: "suika"
  }
];

loadConfig("default").then(
  () => {
    init();
    animate();
  }
);

function init() {

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

  console.log(window.navigator.userAgent);
  let isMobile = detectMobileDevice(window.navigator.userAgent);
  if(isMobile){
    document.addEventListener('touchstart', UI.onDocumentTouchStart);
    document.addEventListener('touchmove', UI.onDocumentSwipe);
    document.addEventListener('touchend', UI.onDocumentTouched);
  } else {
    document.addEventListener('mousemove', UI.onDocumentMouseMove);
    document.addEventListener('click', UI.onDocumentClick);
    window.addEventListener('keydown', UI.onKeydown);
  }

  window.addEventListener('resize', UI.onWindowResize);

  // Debug UI
  document.getElementById("camPos")?.addEventListener('input', UI.onCamDebugChanged);
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

export function createColorSph(rank: number, position: number[], rotation: number[]) {
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
  if (position[0] < -acceptRange) position[0] = -acceptRange;
  else if (position[0] > acceptRange) position[0] = acceptRange;
  if (position[1] < -acceptRange) position[1] = -acceptRange;
  else if (position[1] > acceptRange) position[1] = acceptRange;

  mesh.position.set(position[0], position[1], position[2]); // Type of pos must be THREE.vector3
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]); // Type of rotation must be THREE.euler
  const physicalElem = new PHYS.Physical(mesh, [0, 0, 0], rank, radius);
  PHYS.sphs.push(physicalElem);
  scene.add(mesh);
}

export function rankUpSph(sph: PHYS.Physical) {
  let newRank = sph.rank + 1;
  let radius = config[newRank].radius;
  let myGeo = new THREE.SphereGeometry(radius, 32, 16);
  let textureName = config[newRank].texture;
  let texture = new THREE.TextureLoader().load('textures/' + textureName + '.png');
  let material = new THREE.MeshBasicMaterial({ 
    // color: config[newRank].color,
    map: texture,
   })
  sph.mesh.geometry = myGeo;
  sph.mesh.material = material;
  sph.radius = radius;
  sph.rank = newRank;
}

function createBorder(side: number, height: number, scene: THREE.Scene) { // should be consider it to fit exact size.
  let thickness = 10;
  let opacity = 0.2;
  let myGeo = new THREE.BoxGeometry(2 * (side+thickness), 2 * (side+thickness), thickness, 1, 1, 1);
  let material = new THREE.MeshBasicMaterial({
    opacity: opacity,
    transparent: true,
    color: new THREE.Color("teal"),
  })
  let mesh = new THREE.Mesh(myGeo, material);
  mesh.position.set(0, 0, (-0.5 * (thickness + height)));
  scene.add(mesh);

  let distance = (side+ 0.5* thickness);
  let sideArray = [[0, distance],
  [0, -distance],
  [distance, 0],
  [-distance, 0]];
  let aspectArray = [[2 * (side+thickness), height],
  [2 * (side+thickness), height],
  [height, 2 * (side+thickness)],
  [height, 2 * (side+thickness)]];
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
    })
    let mesh1 = new THREE.Mesh(myGeo1, material1);
    
    mesh1.rotateOnWorldAxis(rotaionArray[i], 0.5 * Math.PI);
    // 충돌 따로 하드코딩 해서 구현
    mesh1.position.set(sideArray[i][0], sideArray[i][1], 0);
    scene.add(mesh1);
  }
}

function createGuide() {
  let myGeo = new THREE.CylinderGeometry(1, 1, PHYS.height, 5, 1, true);
  let myMaterial = new THREE.MeshBasicMaterial({opacity:0.3, transparent:true, color:"white"});
  guideLine = new THREE.Mesh(myGeo, myMaterial);
  guideLine.position.set(0,0,0);
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

export function renewGuideSphere(){
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
    map:texture
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

export function gameOver(){
  PHYS.sphs.splice(0, PHYS.sphs.length);
  alert("game over.");
}

async function loadConfig(mode: string) {
  let fet = await fetch("app_config.json");
  let waiter = fet.json().then(
    (body) => {
      if(mode === "DEFAULT"){
        config = body.DEFAULT;
      } else {
        config = body.DEFAULT;
      }
      return 0;
    },
    (reject) => console.log(reject.message)
  );
  return waiter;
}

function detectMobileDevice(agent: string):boolean {
  let mobileRegex = [
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Window Phone/i
  ];
  return mobileRegex.some( reg => agent.match(reg) );
}