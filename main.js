import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(5, 8, 4);
scene.add(directionalLight);

const positions = Float32Array.from([
    0, 1.5, 0, //vertex 0
    0, -1.5, 0, //vertex 1
    1, 0, 0,   //vertex 2
    0, 0, 1,   //vertex 3
    -1, 0, 0,  //vertex 4
    0, 0, -1   //vertex 5
]); 

const index = [
    0, 3, 2,
    0, 4, 3,
    0, 5, 4,
    0, 2, 5,
    1, 2, 3,
    1, 3, 4,
    1, 4, 5,
    1, 5, 2,
]

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setIndex(index);
geometry.computeVertexNormals();

const material = new THREE.MeshStandardMaterial({ geometry, color: 0x66aaff, roughness: 0.4 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const nonIndexeded = geometry.toNonIndexed();
nonIndexeded.computeVertexNormals();

console.log('Vertices:', geometry.attributes.position.count, 'Faces:', index.length / 3);
console.log('Non-indexed vertices:', nonIndexeded.attributes.position.count, 'Faces:', nonIndexeded.attributes.position.count / 3);

window.addEventListener('keydown', (e) => {
    if (e.key === 'f') {
        mesh.geometry = mesh.geometry === geometry ? nonIndexeded : geometry;
    }
});

const controls = new OrbitControls(camera, renderer.domElement);
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    mesh.rotation.y += 0.005
    renderer.render(scene, camera);

}
animate();