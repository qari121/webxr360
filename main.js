import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const radius = 30;

controls.enablePan = false;
controls.enableZoom = false;

// Set initial camera position for a better view
let spherical = new THREE.Spherical(10, Math.PI / 2, 0);
spherical.makeSafe();
camera.position.setFromSpherical(spherical);

const videoElement = document.createElement('video');
videoElement.src = '0305.mp4';
videoElement.loop = true;
videoElement.muted = true;
videoElement.playsInline = true;
videoElement.crossOrigin = 'anonymous';
videoElement.play();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add event listeners for video loading
videoElement.addEventListener('loadeddata', function () {
    // Video loaded successfully
});

videoElement.addEventListener('error', function () {
    console.error('Error loading video');
});

const texture = new THREE.VideoTexture(videoElement);

// Modify geometry to support top-bottom mapping for both eyes
const geometryLeftTB = new THREE.SphereGeometry(
    120,  // Radius
    60,   // Width segments
    40,   // Height segments
    Math.PI / 2 + Math.PI / 4,  // Phi start
    Math.PI + Math.PI / 2         // Phi length
);
const geometryRightTB = geometryLeftTB.clone();

geometryLeftTB.scale(-1, 1, 1);  // Invert the geometry on the x-axis for left eye
geometryRightTB.scale(1, 1, 1);   // No need to invert for right eye

// Adjust UV mapping for top-bottom for both eyes
const uvsLeftTB = geometryLeftTB.attributes.uv.array;
const uvsRightTB = geometryRightTB.attributes.uv.array;

for (let i = 1; i < uvsLeftTB.length; i += 2) {
    uvsLeftTB[i] *= 0.5;   // Reduce V-coordinate range to half for left eye
    uvsLeftTB[i] += 0.5;   // Offset V-coordinate to the top half for left eye

    uvsRightTB[i] *= 0.5;  // Reduce V-coordinate range to half for right eye
}

const material = new THREE.MeshBasicMaterial({ map: texture }); // Use the correct texture here

// Create meshes for both eyes with the modified geometries
const meshLeftTB = new THREE.Mesh(geometryLeftTB, material);
const meshRightTB = new THREE.Mesh(geometryRightTB, material);

meshLeftTB.layers.set(1);  // Display in left eye only
meshRightTB.layers.set(2); // Display in right eye only

meshLeftTB.visible = false;
meshRightTB.visible = false;

// Position the meshes
meshLeftTB.position.setZ(-120);
meshRightTB.position.setZ(-120);

scene.add(meshLeftTB, meshRightTB);

document.body.appendChild(VRButton.createButton(renderer));

renderer.xr.enabled = true;
renderer.setAnimationLoop(function () {
    controls.update(); // Update controls in the animation loop
    renderer.render(scene, camera);
});

// Handle window resize events
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
