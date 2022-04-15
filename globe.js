import vertexShader from './shaders/vertex.glsl'

console.log(vertexShader);

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

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// create a sphere
var radius = 5;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 50, 30),

  // new THREE.MeshPhongMaterial({
  //   // color: colors.water,
  //   map: new THREE.TextureLoader().load("./textures/8081_earthmap10k.jpg"),
  //   shininess: 100
  // })

  new THREE.ShaderMaterial({
    // vertexShader: 
  })
);

// add sphere and adjust camera & sphere positions
scene.add(sphere);
sphere.position.x = 0;
sphere.position.y = 10;
sphere.position.z = 5;

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

// Camera pivot (only works if no spin controls)
// var cameraPivot = new THREE.Object3D();
// sphere.add(cameraPivot);
// cameraPivot.add(camera);
// camera.position.set(0, 0, 20);

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
  // pointLight.position.set(0, 14, 10); // kinda top lit
  scene.add(pointLight);

  // TODO delete later
  const sphereSize = 1;
  const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
  scene.add(pointLightHelper);
}

function setLight(color){
  // pointLight.color.setHex(color);
  ambientLight.color.setHex(color);
  // renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  // sphere.rotation.y -= 0.005;
  // cameraPivot.rotation.y += 0.001;
  // orbitControl.update();
  renderer.render(scene, camera);
  spinControl.update();
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var buttons = document.getElementsByTagName("button");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", onButtonClick, false);
};

function onButtonClick(event) {
  // alert(event.target.id);
  console.log(event.target.id);

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