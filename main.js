import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
75, window.innerWidth / window.innerHeight, 0.1, 1000

)
camera.position.set(8, 6, 12)
camera.lookAt(0, 0, 0)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
)
ground.rotation.x = -Math.PI / 2
const grid = new THREE.GridHelper(20, 20)
grid.position.y = 0.01
scene.add(ground, grid)


const ambient = new THREE.AmbientLight(0xffffff, 0.5)
const directional = new THREE.DirectionalLight(0xffffff, 2)
directional.position.set(5, 10, 5)
scene.add(ambient, directional)


const orbitControls = new OrbitControls(camera, renderer.domElement)
function animate(){
    requestAnimationFrame(animate)
    orbitControls.update()
    renderer.render(scene, camera)

}
animate()

const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32)
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 })
const base = new THREE.Mesh(baseGeometry, baseMaterial)
base.position.y = 0.5
scene.add(base)

const shoulder = new THREE.Group();
shoulder.position.y = 0.5
base.add(shoulder)

const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), baseMaterial)
shoulder.add(shoulderJoint)

const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3399ff })
const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3, 0.7), armMaterial)
upperArm.position.y = 1.5
shoulder.add(upperArm)

const elbow = new THREE.Group();
elbow.position.y = 1.5
upperArm.add(elbow)

const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), baseMaterial)
elbow.add(elbowJoint)

const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3, 0.6), armMaterial)
forearm.position.y = 1.25
elbow.add(forearm)

const wrist = new THREE.Group();
wrist.position.y = 1.7
forearm.add(wrist)

const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), baseMaterial)
wrist.add(wristJoint)

const fingerMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa55 })
const palm = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.5, 0.5), fingerMaterial)
palm.position.y = 1
wrist.add(palm)

const fingerGeometry = new THREE.BoxGeometry(0.3, 1, 0.45)
for (const x of [-0.9, -0.45, 0, 0.45, 0.9]) {
    const finger = new THREE.Mesh(fingerGeometry, fingerMaterial)
    finger.position.set(x, 1.15, 0)
    palm.add(finger)
}

shoulder.rotation.z = THREE.MathUtils.degToRad(-20)
elbow.rotation.z = THREE.MathUtils.degToRad(40)
wrist.rotation.z = THREE.MathUtils.degToRad(-20)

const rotationSteps = THREE.MathUtils.degToRad(5)
window.addEventListener('keydown', function (event) {
    const key = event.key.toLowerCase()
    if (key === 'q') {
        shoulder.rotation.z += THREE.MathUtils.degToRad(5)
    } else if (key === 'a') {
        shoulder.rotation.z -= THREE.MathUtils.degToRad(5)
    } else if (key === 'w') {
        elbow.rotation.z += THREE.MathUtils.degToRad(5)
    } else if (key === 's') {
        elbow.rotation.z -= THREE.MathUtils.degToRad(5)
    } else if (key === 'e') {
        wrist.rotation.z += THREE.MathUtils.degToRad(5)
    } else if (key === 'd') {
        wrist.rotation.z -= THREE.MathUtils.degToRad(5)
    }
})  


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
