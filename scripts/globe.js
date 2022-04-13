// set scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

// define renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// create the globe
var radius = 5;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 50, 30),
  new THREE.MeshBasicMaterial({
    // color: 0xff0000
    map: new THREE.TextureLoader().load("./textures/8081_earthmap10k.jpg"),
  })
  // new THREE.ShaderMaterial({
  //   vertexShader: ,
  //   fragmentShader:
  // })
);

scene.add(sphere);
sphere.position.x = 0;
sphere.position.y = 0;
sphere.position.z = -15;

// create the moon
const moongeometry = new THREE.SphereGeometry(0.1, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({
  // roughness: 5,
  // metalness: 0,
  map: new THREE.TextureLoader().load("./textures/moonmap4k.jpg"),
  bumpMap: new THREE.TextureLoader().load("./textures/moonbump4k.jpg"),
  bumpScale: 0.02,
});

const moon = new THREE.Mesh(moongeometry, moonMaterial);
moon.receiveShadow = true;
moon.castShadow = true;
moon.position.x = 0;
moon.position.y = 0;
moon.position.z = -15;
// moon.layers.set(0);
scene.add(moon);

// moon pivots around the globe
var moonPivot = new THREE.Object3D();
sphere.add(moonPivot);
moonPivot.add(moon);

// spin & controls
var spinControl = new SpinControls(sphere, radius, camera, renderer.domElement);
var cameraSpinControl = new CameraSpinControls(camera, renderer.domElement);

// account for browser window resizing
window.addEventListener("resize", onWindowResize, false);
cameraSpinControl.onWindowResize();

// animate
function animate() {
  requestAnimationFrame(animate);

  // sphere.rotation.y -= 0.005;

  moonPivot.rotation.y -= 0.005;
  moonPivot.rotation.x = 0.5;
  renderer.render(scene, camera);
  spinControl.update();
}

animate();

// account for window resizing
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
