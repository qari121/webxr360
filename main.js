import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

const renderer = new THREE.WebGLRenderer();
const controls= new OrbitControls(camera,renderer.domElement);
const radius = 30;

controls.enablePan = false;
controls.enableZoom = false;

// Points the camera at the horizon by default
let spherical = new THREE.Spherical(1, Math.PI / 2, 0);
spherical.makeSafe();
camera.position.setFromSpherical(spherical);

const video = document.createElement('video');
video.src = '0305.mp4';
video.loop = true;
video.muted = true;
video.playsInline = true;
video.crossOrigin = 'anonymous';
video.play();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const texture = new THREE.VideoTexture(video);
const geometry = new THREE.SphereGeometry(radius, 48, 32);
const material = new THREE.MeshBasicMaterial({ map: texture });
material.side = THREE.BackSide;

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

document.body.appendChild( VRButton.createButton( renderer ) );

renderer.xr.enabled = true;
renderer.setAnimationLoop( function () {

	renderer.render( scene, camera );

} );

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();


