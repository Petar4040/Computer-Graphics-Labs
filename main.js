import * as THREE from 'three';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const aspect = window.innerWidth / window.innerHeight;
const perspective = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
perspective.position.set(2, 2, 10);
perspective.lookAt(0, 0, 0);
scene.add(perspective);

const size = 8;
const ortographic = new THREE.OrthographicCamera(
    -size * aspect,
    size * aspect,
    size,
    -size,
    0.1,
    100
);
ortographic.position.set(0, 0, 10);
ortographic.lookAt(0, 0, 0);
scene.add(ortographic);

const cameras = [perspective, ortographic]
let current = 0
console.log('Current camera:', cameras[current]);

addEventListener('keydown', (e) => {
    if(e.code === 'Space') {
        current = current + 1
        if(current >= cameras.length) {
            current = 0
        }
        console.log('Current camera:', current ===0 ? 'Perspective' : 'Orthographic')
    }
});




const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
scene.add(ambientLight, directionalLight);



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new PLYLoader().load('models/3D.ply', function (geo) {
    geo.center()
    const models = [
        { color: 0xdb8787, position: [-3, 0, 2] },
        { color: 0xffa500, position: [0, 0, 0] },
        { color: 0x87db9d, position: [3, 0, -2] }
    ];

    models.forEach(({ color, position }) => {
        const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.5 }));
        mesh.scale.setScalar(0.02);
        mesh.position.set(...position);
        mesh.rotation.x = -Math.PI;
        scene.add(mesh);
    });
});



function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, cameras[current]);
}
animate();