import * as THREE from 'three';
import * as PHYS from './physics.js';
import * as UI from './UI.js';
// import Stats from 'three/addons/libs/stats.module.js';
let container; //, stats;
container = document.getElementById('container');
export let camera;
export let scene;
export let renderer;
const zAxis = new THREE.Vector3(0, 0, 1);
let debTab = document.getElementsByClassName("debTab");
init();
animate();
function init() {
    var _a;
    container = document.getElementById('container');
    // camera = new THREE.OrthographicCamera();
    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.x = 0;
    camera.position.y = -900;
    camera.position.z = 900;
    // camera.rotation.setFromQuaternion(
    //   new THREE.Quaternion()
    //   .setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 )
    // );
    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");
    const light = new THREE.AmbientLight();
    // const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0, 0, 1);
    scene.add(light);
    let border = createBorder(PHYS.side, PHYS.height, scene);
    let mesh = createSph(20, 'test', [0, 0, 0.5 * PHYS.height], [0, 0, 0]);
    scene.add(mesh);
    // Finally, (prepare) Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    container.appendChild(renderer.domElement);
    // 리스너는 상시대기 시키는겨...?
    document.addEventListener('mousemove', UI.onDocumentMouseMove);
    document.addEventListener('click', UI.onDocumentClick);
    window.addEventListener('resize', UI.onWindowResize);
    // Debug UI
    (_a = document.getElementById("camPos")) === null || _a === void 0 ? void 0 : _a.addEventListener('change', UI.onCamDebugChanged);
}
export function createSph(radius, textureName, position, rotation) {
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
    const physicalElem = new PHYS.Physical(mesh, [0, 0, 0], false, radius);
    PHYS.sphs.push(physicalElem);
    console.log('sphere created.');
    return mesh;
}
function createBorder(side, height, scene) {
    let thickness = 10;
    let opacity = 0.2;
    let myGeo = new THREE.BoxGeometry(2 * side, 2 * side, thickness, 1, 1, 1);
    let material = new THREE.MeshBasicMaterial({
        opacity: opacity,
        transparent: true,
        color: new THREE.Color("white")
    });
    let mesh = new THREE.Mesh(myGeo, material);
    mesh.position.set(0, 0, (thickness - 0.5 * height));
    // const physicalElem = new PHYS.Physical(mesh, [0,0,0], true);
    scene.add(mesh);
    //
    let distance = (side - thickness * 0.5);
    let sideArray = [[0, distance],
        [0, -distance],
        [distance, 0],
        [-distance, 0]];
    let aspectArray = [[2 * side, height],
        [2 * side, height],
        [height, 2 * side],
        [height, 2 * side]];
    let rotaionArray = [new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 1, 0)];
    for (let i = 0; i < 4; i++) {
        let myGeo1 = new THREE.BoxGeometry(aspectArray[i][0], aspectArray[i][1], thickness, 1, 1, 1);
        let material1 = new THREE.MeshBasicMaterial({
            opacity: opacity,
            transparent: true,
            color: new THREE.Color("white")
        });
        let mesh1 = new THREE.Mesh(myGeo1, material1);
        mesh1.position.set(0, 0, -height);
        mesh1.rotateOnWorldAxis(rotaionArray[i], 0.5 * Math.PI);
        // const physicalElem1 = new PHYS.Physical(mesh1, [0,0,0], true);
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
}
// scene is referred at ACTUAL render function.
function render() {
    // 아하 마우스 위치랑 카메라 위치랑 같을 때 까지 움직이는 거구나. constant 가 너무 높으면 instable 해 질 수 있지.
    // 이런식으로 smooth transition 을 구현하네. physics 에 쓸 것은 아니지만... 
    // UI (회전) 같은 데엔 쓸 수 있겠다 싶음.
    // camera.position.x += (mouseX - camera.position.x) * 0.05;
    // camera.position.y += (- mouseY - camera.position.y) * 0.05;
    // 여기에 리소스 낭비하게 만들고 싶진 않음...
    PHYS.physics(PHYS.sphs);
    UI.debugging(debTab);
    camera.lookAt(scene.position);
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), ((UI.getAngle) * Math.PI));
    renderer.render(scene, camera); // OF COURSE we use prepared renderer.
}
//# sourceMappingURL=script.js.map