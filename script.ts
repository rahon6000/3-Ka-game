import * as THREE from 'three';
// import Stats from 'three/addons/libs/stats.module.js';

let container //, stats;
container = document.getElementById('container');
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer:THREE.WebGLRenderer;

let mouseX = 0, mouseY = 0, clickX = 0, clickY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let G = new THREE.Vector3(0,0,-1);
let sphs: Physical[] = []; // managing all fruits

// should consider frame
class Physical {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  constructor(mesh: THREE.Mesh, vel: number[]){
    this.mesh = mesh;
    this.vel = new THREE.Vector3(vel[0], vel[1], vel[2]);
    
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

let debTab: HTMLCollectionOf<Element> = document.getElementsByClassName("debTab");

init();
animate();




function init() {

  container = document.getElementById('container') as HTMLElement;


  // camera = new THREE.OrthographicCamera();
  camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1800;
  // camera.rotation.z = 1;

  scene = new THREE.Scene();
  scene.background = new THREE.Color("skyblue");

  const light = new THREE.AmbientLight();
  // const light = new THREE.DirectionalLight(0xffffff, 3);

  light.position.set(0, 0, 1);
  scene.add(light);

  let mesh = createSph(20, 'test', [0, 0, 1000], [0, 0, 0]);
  scene.add(mesh);

  // Finally, (prepare) Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
  container.appendChild(renderer.domElement);

  // 리스너는 상시대기 시키는겨...?
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('click', onDocumentClick);
  

  window.addEventListener('resize', onWindowResize);

  // Debug UI
  document.getElementById("camPos")?.addEventListener('change', onCamDebugChanged);

}

function createSph(radius: number, textureName: string, position: number[], rotation: number[]) {
  // Create spheres
  // const myGeo = new THREE.IcosahedronGeometry(radius, 1); // 디폴트 UV 맵이 맘에 안듬.
  let myGeo = new THREE.SphereGeometry(radius, 32, 16);

  // const count = myGeo.attributes.position.count;
  // myGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  // const color = new THREE.Color();
  // const positions1 = myGeo.attributes.position;
  // const colors1 = myGeo.attributes.color;
  // for (let i = 0; i < count; i++) { // 메쉬 구성요소에 일일히 색을 입히는 것 같음.
  //   color.setHSL((positions1.getY(i) / radius + 1) / 2, 1.0, 0.5, THREE.SRGBColorSpace);
  //   colors1.setXYZ(i, color.r, color.g, color.b);
  // }

  let texture = new THREE.TextureLoader().load('textures/' + textureName + '.png');
  let material = new THREE.MeshBasicMaterial({ map: texture });

  // Create mesh from Geometry & Material. ADD TO THE SCENE!
  let mesh = new THREE.Mesh(myGeo, material);
  let textured = new THREE.Mesh(myGeo, material);
  mesh.add(textured);
  // mesh.position.x = 0;
  mesh.position.set(position[0], position[1], position[2]); // Type of pos must be THREE.vector3
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]); // Type of rotation must be THREE.euler
  const physicalElem = new Physical(mesh, [0,0,0]);
  sphs.push(physicalElem);
  console.log('sphere created.')
  return mesh;
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  // 창 크기 변환시 camera 를 업데이트 한다.
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event: MouseEvent) {

  mouseX = (event.clientX - windowHalfX);
  mouseY = -(event.clientY - windowHalfY);
}

function onDocumentClick(event: MouseEvent) {
  clickX = (event.clientX - windowHalfX);
  clickY = -(event.clientY - windowHalfY);
  let newMesh = createSph(Math.random() * 20 + 1, 'test', [clickX, clickY, 0], [0, 0, 0]);
  scene.add(newMesh);

}

// 얘가 한번만이 아닌 계속 작동하는 원리는 뭐야?
function animate() {

  requestAnimationFrame(animate);

  render();
  // stats.update();

}

// scene is referred at ACTUAL render function.
function render() {

  // 아하 마우스 위치랑 카메라 위치랑 같을 때 까지 움직이는 거구나. constant 가 너무 높으면 instable 해 질 수 있지.
  // 이런식으로 smooth transition 을 구현하네. physics 에 쓸 것은 아니지만... 
  // UI (회전) 같은 데엔 쓸 수 있겠다 싶음.
  // camera.position.x += (mouseX - camera.position.x) * 0.05;
  // camera.position.y += (- mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera); // OF COURSE we use prepared renderer.
  physics(sphs);
  debugging(debTab);


}

// should separate debugging part to another .js

function debugging(debTab: HTMLCollectionOf<Element>) {
  try {
    debTab.item(0)!.innerHTML = "(" + mouseX + ", " + mouseY + ")";
    debTab.item(1)!.innerHTML = "(" + windowHalfX + ", " + windowHalfY + ")";
    debTab.item(2)!.innerHTML = "(" + Math.round(camera.position.x) + ", " + Math.round(camera.position.y) + ")";
    debTab.item(3)!.innerHTML = "(" + sphs.length + ")";
    debTab.item(4)!.innerHTML = "(" + sphs[0].getPosFromMesh() + ")";
    debTab.item(5)!.innerHTML = "(" + sphs[0].getVelFromMesh() + ")";
  } catch (error) {
    
  }
  
  

}

function onCamDebugChanged(event: Event){
  // @ts-ignore
  camera.position.x = event.currentTarget!.camX.value; 
  // @ts-ignore
  camera.position.y = event.currentTarget!.camY.value;
}

function physics(elements: Physical[]) {
  for(let i = 0; i < elements.length; i++){
    // console.log(elements.getPosFromMesh()[0]);
    elements[i].nextPosition();
    elements[i].accelerate(G);
  }
}