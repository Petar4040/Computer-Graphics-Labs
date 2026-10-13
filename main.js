import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(5, 6, 7)
camera.lookAt(0, 0, 0)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.3)
scene.add(pointLight, ambientLight)

const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0x75c518, emissive: 0xE8431c, roughness: 0.9, intensity: 0.6 })
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)

const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit)

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0X1E40FF, roughness: 0.9 })
)
earth.position.x = 6
earthOrbit.add(earth)

const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit)
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x134661 })
)
moon.position.x = 1.8
moonOrbit.add(moon)

// 
const saturnOrbit = new THREE.Object3D();
sun.add(saturnOrbit);

const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xd6b77c, roughness: 0.9 })
);


saturn.position.x = -10;
saturnOrbit.add(saturn);

const saturnRing = new THREE.Mesh(
    new THREE.RingGeometry(1.5, 2.3, 64),
    new THREE.MeshStandardMaterial({
        color: 0xc9b58a,
        side: THREE.DoubleSide,
        roughness: 0.9
    })
);

saturnRing.rotation.x = Math.PI / 2;
saturn.add(saturnRing);

const titanOrbit = new THREE.Object3D();
saturn.add(titanOrbit);

const titan = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xB48F62, roughness: 0.9 })
);

titan.position.set(2, 0.45, 0);
titanOrbit.add(titan);

const control = new OrbitControls(camera, renderer.domElement);
function animate() {
    requestAnimationFrame(animate)
    control.update()
    earthOrbit.rotation.y += 0.01

    saturnOrbit.rotation.y += 0.008
    titanOrbit.rotation.y += 0.05

    moonOrbit.rotation.y += 0.04
    earth.rotation.y += 0.05

    sun.rotation.y += 0.003

    renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
})