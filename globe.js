import vertex from './shaders/vertex.js'
import fragment from './shaders/fragment.js'

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

// colors for lighting
var colors = {
  red: 0xFF0000,
  orange: 0xFF8000,
  yellow: 0xFFFF00,
  white: 0xFFFFFF,
  green: 0x00FF00,
  cyan: 0x00FFFF,
  blue: 0x0000FF,
  pink: 0xFF00FF,
  purple: 0x7F00FF,
  water: 0x1E5772
};

// default light values
var pointLightIntensity, pointLightColor, pointLight;
var ambientLight, ambientLightColor;

// clock used for moon
const clock = new THREE.Clock();

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

// create a sphere (Earth)
var radius = 5;
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 50, 30),

  new THREE.MeshPhongMaterial({
    // color: colors.water,
    map: new THREE.TextureLoader().load("./textures/8081_earthmap10k.jpg"),
    bumpMap: new THREE.TextureLoader().load("./textures/8081_earthmap10k_grayscale.jpg"),
    bumpScale: 2,
    emissive: colors.water,
    emissiveIntensity: 0.25,
    reflectivity: 1,
    shininess: 100
  })

  // if we wanted to use custom vertex / fragment shaders...
  // new THREE.ShaderMaterial({
  //   vertexShader: vertex,
  //   fragmentShader: fragment,
  //   uniforms: {
  //     globeTexture: {
  //       value: new THREE.TextureLoader().load('./textures/8081_earthmap10k.jpg')
  //     }
  //   }
  // })
);

// create moon
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 50, 30),
  new THREE.MeshPhongMaterial({
    // color: colors.orange,
    map: new THREE.TextureLoader().load("./textures/moonbump4k.jpg"),
    bumpMap: new THREE.TextureLoader().load("./textures/moonmap4k.jpg"),
    emissive: colors.white,
    emissiveIntensity: 0.25,
    reflectivity: 1,
    shininess: 100
  })
);

// add & position objects
scene.add(sphere);
sphere.position.set(0, 10, 5);

scene.add(moon);
moon.scale.set(0.1, 0.1, 0.1);
moon.position.set(-10, 10, 5);

// spin controls
var spinControl = new SpinControls(sphere, radius, camera, renderer.domElement);
var cameraSpinControl = new CameraSpinControls(camera, renderer.domElement);

// const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 10, 20);
// orbitControl.update();

// lighting and shadows
renderer.shadowMap.enabled = true;
sphere.receiveShadow = true;
sphere.castShadow = true;

// account for browser window resizing
window.addEventListener("resize", onWindowResize, false);
cameraSpinControl.onWindowResize();

// set lighting
function initLight() {
  ambientLightColor = colors.white;
  ambientLight = new THREE.AmbientLight(ambientLightColor); // soft white light
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
  
  //sphere position
  // sphere.position.x = Math.sin(elapsed/2) * 3;
  // sphere.position.z = Math.cos(elapsed/2) * 3;
  
  moon
  moon.position.x =  (sphere.position.x + Math.sin(elapsed*2) * 2) * 3;
  moon.position.z = (sphere.position.z + Math.cos(elapsed*2) * 2) * 1.5;
  moon.rotation.x += 0.4 * delta;
  moon.rotation.y += 0.2 * delta;

  moon.rotateY(0.004);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  spinControl.update();

  // Other options I explored for rotations
  // sphere.rotation.y -= 0.005;
  // cameraPivot.rotation.y += 0.001;
  // orbitControl.update();
}

// resize based on browser window
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// buttons for different lighting colors
var buttons = document.getElementsByTagName("button");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", onButtonClick, false);
};

// button onClick for lighting color buttons
function onButtonClick(event) {
  console.log(event.target.id); // the button clicked

  if (event.target.id == "red") {
    setLight(colors.red);
  } else if (event.target.id == "cyan") {
    setLight(colors.cyan);
  } else if (event.target.id == "default") {
    setLight(colors.white);
  } else if (event.target.id == "yellow") {
    setLight(colors.yellow);
  }
}

initLight();
animate();