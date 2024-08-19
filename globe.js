import * as THREE from 'three';
import vertex from './shaders/vertex.js'
import blueFragment from './shaders/blueFragment.js'
import redFragment from './shaders/redFragment.js'
import SpinControls from './scripts/SpinControls.js'
import CameraSpinControls from './scripts/CameraSpinControls.js'

// create new threejs scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

var pointLightIntensity, pointLightColor, pointLight;
var ambientLight, ambientLightColor;
const clock = new THREE.Clock(); // clock used for moon orbiting

// colors for lighting
var colors = {
  red: 0xFF0000,
  orange: 0xFF8000,
  yellow: 0xFFFF00,
  white: 0xFFFFFF,
  black: 0x000000,
  green: 0x00FF00,
  cyan: 0x00FFFF,
  blue: 0x0000FF,
  pink: 0xFF00FF,
  purple: 0x7F00FF,
  water: 0x1E5772
};

var currentPlanet = 0; // index value; earth by default
var planets =  ["earth", "mars", "jupiter", "saturn", "uranus", "neptune", "mercury", "venus"]
var planetMaterials = {
  "earth": new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./textures/8081_earthmap4k.jpg"),
    bumpMap: new THREE.TextureLoader().load("./textures/8081_earthmap10k_grayscale.jpg"),
    bumpScale: 2
  }),
  "mars": new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./textures/8k_mars.jpg"),
    bumpMap: new THREE.TextureLoader().load("./textures/8k_mars_bump.jpg"),
    bumpScale: 2
  }),
  "jupiter": new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./textures/8k_jupiter.jpg"),
  }),
  "saturn": new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./textures/8k_saturn.jpg"),
  }),
  "uranus": new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./textures/2k_uranus.jpg"),
  }),
  "neptune": new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./textures/2k_neptune.jpg"),
  }),
  "mercury": new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./textures/mercury_texture_nasa.jpg"),
    bumpMap: new THREE.TextureLoader().load("./textures/8k_mercury.jpg"),
    bumpScale: 2 
  }),
  "venus": new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./textures/8k_venus_surface.jpg"),
  })
}

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// add "stars" (particles) to background 
const pointsMaterial = new THREE.PointsMaterial({
  size: 0.015
})

const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 10000;
const posArray = new Float32Array(particlesCnt * 3);

for (let i = 0; i < particlesCnt * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 40;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMesh = new THREE.Points(particlesGeometry, pointsMaterial);
scene.add(particlesMesh)
particlesMesh.position.x = 0;
particlesMesh.position.y = 10;
particlesMesh.position.z = 0;

// create a sphere -> texture is earth by default
var sphereRadius = 5;
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(sphereRadius, 50, 30),
  planetMaterials.earth
);

// create atmospheres
const blueAtmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(sphereRadius, 50, 30),
  new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: blueFragment,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)

const redAtmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(sphereRadius, 50, 30),
  new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: redFragment,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)

// create moon for earth
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(sphereRadius, 50, 30),
  new THREE.MeshStandardMaterial({
    // color: colors.orange,
    map: new THREE.TextureLoader().load("./textures/moonbump4k.jpg"),
    bumpMap: new THREE.TextureLoader().load("./textures/moonmap4k.jpg"),
    emissive: colors.white,
    emissiveIntensity: 0.25
  })
);

// create ring for saturn
const ringsTexture = new THREE.TextureLoader().load("./textures/2k_saturn_ring_alpha.png");
ringsTexture.rotation = 90;
ringsTexture.wrapS = THREE.RepeatWrapping;
ringsTexture.wrapT = THREE.RepeatWrapping;

const rings = new THREE.Mesh(
  new THREE.TorusGeometry(10, 0.25, 16, 100),
  new THREE.MeshStandardMaterial({
    map: ringsTexture})
);

// add & position objects
scene.add(sphere);
sphere.position.set(0, 10, 5);

scene.add(blueAtmosphere);
blueAtmosphere.position.set(0, 10, 5);
blueAtmosphere.scale.set(1.25, 1.25, 1.25);

scene.add(redAtmosphere);
redAtmosphere.position.set(0, 10, 5);
redAtmosphere.scale.set(1.25, 1.25, 1.25);
redAtmosphere.visible = false;

scene.add(moon);
moon.scale.set(0.1, 0.1, 0.1);
moon.position.set(-10, 10, 5);

scene.add(rings);
rings.position.set(0, 9, 5);
rings.rotation.set(80, 0, -11);
rings.visible = false;

// spin controls
var spinControl = new SpinControls(sphere, sphereRadius, camera, renderer.domElement);
spinControl.dampingFactor = 1.5;

var cameraSpinControl = new CameraSpinControls(camera, renderer.domElement);
cameraSpinControl.startTrackballScreenCenter = false; 

camera.position.set(0, 10, 20);

// lighting and shadows
renderer.shadowMap.enabled = true;
sphere.receiveShadow = true;
sphere.castShadow = true;
moon.receiveShadow = true;
moon.castShadow = true;

// set lighting
function initLight() {
  ambientLightColor = colors.white;
  ambientLight = new THREE.AmbientLight(ambientLightColor);
  scene.add(ambientLight);

  pointLightIntensity = 0.4;
  pointLightColor = colors.white;
  pointLight = new THREE.PointLight(pointLightColor, pointLightIntensity, 1000, 2);
  pointLight.position.set(0, 10, 80); // centered
  scene.add(pointLight);

  // pointLightHelper to visualize where point light is located
  const sphereSize = 1;
  const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
  scene.add(pointLightHelper);
}

function setLight(color){
  // pointLight.color.setHex(color);
  ambientLight.color.setHex(color);
}

function animate() {
  // moon orbit
  var delta = clock.getDelta();
  var elapsed = clock.elapsedTime;
  
  moon.position.x =  (sphere.position.x + Math.sin(elapsed*2) * 2) * 3;
  moon.position.z = (sphere.position.z + Math.cos(elapsed*2) * 2) * 1.5;
  moon.position.y = ((sphere.position.y + 0.5) + Math.sin(elapsed*2) * 2);
  moon.rotation.x += 0.4 * delta;
  moon.rotation.y += 0.2 * delta;

  moon.rotateY(0.004);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  spinControl.update();
}

// resize based on browser window
function onWindowResize() {
  cameraSpinControl.onWindowResize();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

// buttons for different lighting colors
var buttons = document.getElementsByTagName("button");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", onButtonClick, false);
};

window.addEventListener("keydown", onKeyDown, false);

function onButtonClick(event) {
  // console.log(event.target.id); // the button clicked
  if (event.target.id == "red") {
    setLight(colors.red);
  } else if (event.target.id == "purple") {
    setLight(colors.purple);
  } else if (event.target.id == "default") {
    setLight(colors.white);
  } else if (event.target.id == "yellow") {
    setLight(colors.yellow);
  }
}

// cycle through planets on key press
// 65 = A, 68 = D
function onKeyDown(event) {
  if (event.keyCode == 65) { // cycle left
    if (currentPlanet == 0) { // earth
      moon.visible = false;
      currentPlanet = 7; // venus
    } else if (currentPlanet == 1) { // mars
      moon.visible = true;
      currentPlanet = 0; // earth
    } else {
      currentPlanet = currentPlanet - 1;
    }
    sphere.material = planetMaterials[planets[currentPlanet]];
  } else if (event.keyCode == 68) { // cycle right
    if (currentPlanet == 7) { // venus
      currentPlanet = 0; // earth
      moon.visible = true;
    } else if (currentPlanet == 0) { // earth
      moon.visible = false;
      currentPlanet = 1;
    } else {
      currentPlanet = currentPlanet + 1;
    }
  }
    
    if (currentPlanet == 0 || currentPlanet == 4 || currentPlanet == 5) {
      blueAtmosphere.visible = true;
    } else {
      blueAtmosphere.visible = false;
    }

    if (currentPlanet == 1) {
      redAtmosphere.visible = true;
    } else {
      redAtmosphere.visible = false;
    }

    if (currentPlanet == 3) { // saturn
      rings.visible = true;
    } else { 
      rings.visible = false; 
    }

    sphere.material = planetMaterials[planets[currentPlanet]];
}

initLight();
animate();