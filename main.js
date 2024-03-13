import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/addons/webxr/VRButton.js';

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
const geometry = new THREE.SphereGeometry(radius, 48, 32);
const material = new THREE.MeshBasicMaterial({ map: texture });
material.side = THREE.BackSide;

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

document.body.appendChild(VRButton.createButton(renderer));

renderer.xr.enabled = true;
renderer.setAnimationLoop(function () {
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
