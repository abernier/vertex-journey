import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./index.css";

//
//
//

const $point = document.getElementById("point");

//
// scene
//

const scene = new THREE.Scene();
scene.background = new THREE.Color("#fffaf3");

//
// 🎥 camera
//

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
window.camera = camera;

camera.position.set(-20, 25, 30);

//
// 📷 renderer
//

const renderer = new THREE.WebGLRenderer({ antialias: true });
window.renderer = renderer;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

//
// Meshes
//

// 🧊 cube

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshStandardMaterial({
    color: "#e57ddc",
    transparent: true,
    opacity: 0.95,
  })
);
cube.position.y = 5;
cube.updateMatrixWorld(); //
scene.add(cube);

// point (relative to cube)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.25, 32, 32),
  new THREE.MeshBasicMaterial({ color: "orange" })
);
window.sphere = sphere;
sphere.position.set(-5, 5, 5);
cube.add(sphere);

//
// 💡 lights
//

// 🔦 spot

const spotLight = new THREE.SpotLight("white");
spotLight.position.set(30, 30, 30);
spotLight.intensity = 2;

scene.add(spotLight);

// 🌤️ ambient

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.2;
scene.add(ambientLight);

//
// 📐 dummies
//

const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

//
// 🎬 animation
//

function animate(t) {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);

  const point = sphere.position.clone();
  console.log("point=", point);

  //
  // A: Model -> World
  //

  const M = cube.matrixWorld;
  console.log("Model (World) Matrix", M);
  point.applyMatrix4(M);
  console.log("world-space point=", point);

  //
  // B: World -> Camera (aka View)
  //

  const V = camera.matrixWorldInverse;
  console.log("View Matrix", V);
  point.applyMatrix4(V);
  console.log("view-space point=", point);

  //
  // C: Camera -> NDC
  //

  const P = camera.projectionMatrix;
  console.log("Projection Matrix", P);
  point.applyMatrix4(P);
  console.log("clip coordinates", point);

  //
  // D: NDC -> Screen
  //

  const W = new THREE.Matrix4();
  const { x: WW, y: WH } = renderer.getSize(new THREE.Vector2());
  // prettier-ignore
  W.set(
    WW / 2, 0, 0, WW / 2,
    0, -WH / 2, 0, WH / 2,
    0, 0, 0.5, 0.5,
    0, 0, 0, 1
  );
  console.log("Window Matrix", W);
  point.applyMatrix4(W);
  console.log("window coordinates", point);

  //
  // update the HTML #point element
  //

  const x = Math.round(point.x);
  const y = Math.round(point.y);

  $point.innerText = `(${x}, ${y})`;
  $point.style.left = `${x}px`;
  $point.style.top = `${y}px`;
}
animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);
