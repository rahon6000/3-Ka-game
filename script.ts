import * as THREE from 'three';
import * as PHYS from './physics.js';
import * as UI from './UI.js';
// import Stats from 'three/addons/libs/stats.module.js';

let container //, stats;
container = document.getElementById('container');
export let camera: THREE.PerspectiveCamera;
export let scene: THREE.Scene;
export let renderer: THREE.WebGLRenderer;
export let fps:number = 0;
let then:number;
let now:number;


const zAxis = new THREE.Vector3(0,0,1); 

let debTab: HTMLCollectionOf<Element> = document.getElementsByClassName("debTab");

init();
animate();

function init() {

  container = UI.container;

  console.log("cl-h : " + container.clientHeight);
  console.log("cl-w : " + container.clientWidth);
  console.log("cl-l : " + container.clientLeft);
  console.log("cl-t : " + container.clientTop);
  console.log("of-l : " + container.offsetLeft);
  console.log("of-t : " + container.offsetTop);

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

  let mesh = createSph(20, 'test', [0, 0, 0.5*PHYS.height], [0, 0, 0]);
  scene.add(mesh);

  // Finally, (prepare) Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  // renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setPixelRatio(UI.w_ratio);
  // renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  renderer.setSize(UI.w_width,UI.w_height);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousemove', UI.onDocumentMouseMove);
  document.addEventListener('click', UI.onDocumentClick);
  window.addEventListener('resize', UI.onWindowResize);
  window.addEventListener('keydown', UI.onKeydown);

  // Debug UI
  document.getElementById("camPos")?.addEventListener('input', UI.onCamDebugChanged);
}

export function createSph(radius: number, textureName: string, position: number[], rotation: number[]) {
  // Create spheres
  // const myGeo = new THREE.IcosahedronGeometry(radius, 1); // 디폴트 UV 맵이 맘에 안듬.
  let myGeo = new THREE.SphereGeometry(radius, 32, 16);

  let texture = new THREE.TextureLoader().load('textures/' + textureName + '.png');
  let material = new THREE.MeshBasicMaterial({ map: texture });

  // Create mesh from Geometry & Material. ADD TO THE SCENE!
  let mesh = new THREE.Mesh(myGeo, material);
  let textured = new THREE.Mesh(myGeo, material);
  mesh.add(textured);
  let acceptRange = PHYS.side - radius * 0.5;
  if(position[0] < -acceptRange) position[0] = -acceptRange;
  else if(position[0] > acceptRange) position[0] = acceptRange;
  if(position[1] < -acceptRange) position[1] = -acceptRange;
  else if(position[1] > acceptRange) position[1] = acceptRange;

  mesh.position.set(position[0], position[1], position[2]); // Type of pos must be THREE.vector3
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]); // Type of rotation must be THREE.euler
  const physicalElem = new PHYS.Physical(mesh, [0, 0, 0], false, radius);
  PHYS.sphs.push(physicalElem);
  console.log('sphere created.')
  return mesh;
}

export function createColorSph(Rank: number, position: number[], rotation: number[]) {
  // Create spheres
  // const myGeo = new THREE.IcosahedronGeometry(radius, 1); // 디폴트 UV 맵이 맘에 안듬.
  let radius = config[Rank].radius;
  let myGeo = new THREE.SphereGeometry(radius, 32, 16);

  // let texture = new THREE.TextureLoader().load('textures/' + textureName + '.png');
  let material = new THREE.MeshBasicMaterial({ color:config[Rank].color });

  // Create mesh from Geometry & Material. ADD TO THE SCENE!
  let mesh = new THREE.Mesh(myGeo, material);
  let textured = new THREE.Mesh(myGeo, material);
  mesh.add(textured);
  let acceptRange = PHYS.side - radius * 0.5;
  if(position[0] < -acceptRange) position[0] = -acceptRange;
  else if(position[0] > acceptRange) position[0] = acceptRange;
  if(position[1] < -acceptRange) position[1] = -acceptRange;
  else if(position[1] > acceptRange) position[1] = acceptRange;

  mesh.position.set(position[0], position[1], position[2]); // Type of pos must be THREE.vector3
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]); // Type of rotation must be THREE.euler
  const physicalElem = new PHYS.Physical(mesh, [0, 0, 0], false, radius);
  PHYS.sphs.push(physicalElem);
  console.log('sphere created.')
  return mesh;
}

function createBorder(side: number, height: number, scene: THREE.Scene) { // should be consider it to fit exact size.
  let thickness = 10;
  let opacity = 0.2;
  let myGeo = new THREE.BoxGeometry(2 * side, 2 * side,thickness,1,1,1);
  let material = new THREE.MeshBasicMaterial({ 
    opacity: opacity,
    transparent: true,
    color: new THREE.Color("teal")
  })
  let mesh = new THREE.Mesh(myGeo, material);
  mesh.position.set(0,0,(-0.5 * (thickness + height)));
  // 충돌 따로 하드코딩 해서 구현
  scene.add(mesh);

  let distance = (side - thickness * 0.5);
  let sideArray = [[0, distance],
                    [0, -distance],
                    [distance, 0],
                    [-distance, 0]];
  let aspectArray = [[2 * side, height],
                    [2 * side, height],
                    [height, 2 * side],
                    [height, 2 * side]];
  let rotaionArray = [new THREE.Vector3(1,0,0),
                      new THREE.Vector3(1,0,0),
                      new THREE.Vector3(0,1,0),
                      new THREE.Vector3(0,1,0)];
  for(let i = 0; i < 4; i ++){
    let myGeo1 = new THREE.BoxGeometry(aspectArray[i][0],aspectArray[i][1],thickness,1,1,1);
    let material1 = new THREE.MeshBasicMaterial({ 
      opacity: opacity,
      transparent: true,
      color: new THREE.Color("white")
    })
    let mesh1 = new THREE.Mesh(myGeo1, material1);
    mesh1.position.set(0,0,-height);
    mesh1.rotateOnWorldAxis(rotaionArray[i], 0.5 * Math.PI);
    // 충돌 따로 하드코딩 해서 구현
    mesh1.position.set(sideArray[i][0], sideArray[i][1], 0);
    scene.add(mesh1);
  }


  console.log('plate created.');
  
}

// 얘가 한번만이 아닌 계속 작동하는 원리는 뭐야?
function animate() {
  requestAnimationFrame(animate);
  render();
  // stats.update();
  now = Date.now();
  fps = 1000/(now - then);
  then = now;
}

// scene is referred at ACTUAL render function.
function render() {

  PHYS.physics(PHYS.sphs);
  UI.debugging(debTab);

  renderer.render(scene, camera); // OF COURSE we use prepared renderer.
}

// 🍉 Sphere configuration 🍉
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
]