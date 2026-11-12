import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202028);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(6, 5, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 10, 5);
scene.add(light);

scene.add(new THREE.GridHelper(20, 20));

const pickables = [];

function addPickable(geometry, color, x) {
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color }));
  mesh.position.set(x, 0.5, 0);
  mesh.userData.start = mesh.position.clone();
  scene.add(mesh);
  pickables.push(mesh);
}

addPickable(new THREE.BoxGeometry(1, 1, 1), 0xff5555, -2);
addPickable(new THREE.SphereGeometry(0.5, 32, 16), 0x55ff55, 0);
addPickable(new THREE.ConeGeometry(0.5, 1, 32), 0x5599ff, 2);

const pointer = new THREE.Vector2();

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  return pointer;
}

const raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5);
const point = new THREE.Vector3();
let selected = null;
let dragging = false;

renderer.domElement.addEventListener('pointerdown', (event) => {
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables);

  if (selected) selected.material.emissive.setHex(0x000000);

  if (hits.length > 0) {
    selected = hits[0].object;
    if (settings.highlight) selected.material.emissive.setHex(0x444444);
    dragging = true;
    controls.enabled = false;
  } else {
    selected = null;
  }
});

renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.ray.intersectPlane(plane, point)) {
    selected.position.x = point.x;
    selected.position.z = point.z;
  }
});

window.addEventListener('pointerup', () => {
  dragging = false;
  controls.enabled = true;
});

const settings = {
  highlight: true,
  reset() {
    pickables.forEach((obj) => obj.position.copy(obj.userData.start));
  },
};

const gui = new GUI();
gui.add(settings, 'highlight').name('Highlight').onChange((on) => {
  if (selected) selected.material.emissive.setHex(on ? 0x444444 : 0x000000);
});
gui.add(settings, 'reset').name('Reset positions');

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();