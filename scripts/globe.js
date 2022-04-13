const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

const renderer = new THREE.WebGLRenderer(
  {
    antialias: true
  }
);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// create a sphere
var radius = 5;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 50, 30),
  new THREE.MeshBasicMaterial({
    // color: 0xff0000
    map: new THREE.TextureLoader().load("./textures/8081_earthmap10k.jpg")
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

var spinControl = new SpinControls(sphere, radius, camera, renderer.domElement);
spinControl.update();

var cameraSpinControl = new CameraSpinControls(camera, renderer.domElement);

// account for browser window resizing
// window.addEventListener("resize", onWindowResize, false);
cameraSpinControl.onWindowResize();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
