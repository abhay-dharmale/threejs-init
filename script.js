import * as THREE from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'; // Use EXRLoader instead of RGBELoader
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';



// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 2);

const canvas = document.getElementById('canvas');
// Create a renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const controls = new OrbitControls( camera, renderer.domElement );

// Add a studio light
const studioLight = new THREE.SpotLight(0xffffff, 100);
studioLight.position.set(5, 5, 5);
studioLight.angle = Math.PI / 4;
studioLight.penumbra = 0.1;
studioLight.decay = 2;
studioLight.distance = 200;

// Add a target for the spotlight
const targetObject = new THREE.Object3D();
scene.add(targetObject);
studioLight.target = targetObject;

// Add the light to the scene
scene.add(studioLight);


// Load EXR environment map
// const exrLoader = new EXRLoader();
// exrLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/cobblestone_street_night_1k.exr', function(texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = texture;
//     scene.background = texture;
// });

const gui = new GUI();


// Create a folder for studio light controls
const studioLightFolder = gui.addFolder('Studio Light');
studioLightFolder.add(studioLight.position, 'x', -10, 10);
studioLightFolder.add(studioLight.position, 'y', -10, 10);
studioLightFolder.add(studioLight.position, 'z', -10, 10);
studioLightFolder.add(studioLight, 'intensity', 0, 1000);
studioLightFolder.add(studioLight, 'angle', 0, Math.PI / 2);
studioLightFolder.add(studioLight, 'penumbra', 0, 1);
studioLightFolder.add(studioLight, 'decay', 1, 2);
studioLightFolder.add(studioLight, 'distance', 0, 1000);

// Helper to visualize the light
const spotLightHelper = new THREE.SpotLightHelper(studioLight);
scene.add(spotLightHelper);

// Update the helper when the light changes
studioLightFolder.onChange(() => {
    spotLightHelper.update();
});


const loader = new GLTFLoader();
loader.load('./web_shooter_-_spider-man_2_ps5.glb', function(gltf) {


const positionFolder = gui.addFolder('Position');
positionFolder.add(gltf.scene.position, 'x', -10,10);
positionFolder.add(gltf.scene.position, 'y', -10,10);
positionFolder.add(gltf.scene.position, 'z', -10,10);

    
    scene.add(gltf.scene);
})
// Animation loop
function animate() {
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();

}
animate();

// Handle window resize
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
