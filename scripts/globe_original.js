// const renderer = new THREE.WebGLRenderer();
// const camera = new THREE.PerspectiveCamera(
//   50,
//   window.innerWidth / window.innerHeight,
//   1,
//   1000
// );
// const scene = new THREE.Scene();
// var Mesh, light;

// var targetRotationX = 0;
// var targetRotationOnMouseDownX = 0;

// var targetRotationY = 0;
// var targetRotationOnMouseDownY = 0;

// var mouseX = 0;
// var mouseXOnMouseDown = 0;

// var mouseY = 0;
// var mouseYOnMouseDown = 0;

// var windowHalfX = window.innerWidth / 2;
// var windowHalfY = window.innerHeight / 2;

// var finalRotationY;

// // initialize scene
// function init() {
//   scene.background = new THREE.Color("black");
//   camera.position.set(0, 10, 20);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);

//   document.addEventListener("mousedown", onDocumentMouseDown, false);
//   document.addEventListener("touchstart", onDocumentTouchStart, false);
//   document.addEventListener("touchmove", onDocumentTouchMove, false);

//   // account for browser window resizing
//   window.addEventListener("resize", onWindowResize, false);
// }

// // set lighting
// function setLight() {
//   light = new THREE.AmbientLight(0xffffff); // soft white light
//   scene.add(light);
// }

// // load Blender model
// function loadGLTF() {
//   let balloonLoader = new THREE.GLTFLoader();

//   balloonLoader.load("./models/earthtest.gltf", (gltf) => {
//     Mesh = gltf.scene;
//     //Mesh.scale.set(0.2,0.2,0.2);
//     scene.add(Mesh);
//     Mesh.position.x = 0;
//     Mesh.position.y = 10;
//     Mesh.position.z = 15;
//   });
// }

// // animate the model
// function animate() {
//   requestAnimationFrame(animate);

//   // to rotate the globe on Y axis
//   //
//   // if (Mesh && Mesh.rotation) {
//   //     Mesh.rotation.y -= 0.005;
//   // }
//   //renderer.render(scene, camera);

//   render();
// }

// function render() {
//   //horizontal rotation
//   Mesh.rotation.y += (targetRotationX - Mesh.rotation.y) * 0.1;

//   //vertical rotation
//   finalRotationY = targetRotationY - Mesh.rotation.x;
//   //     Mesh.rotation.x += finalRotationY * 0.05;

//   //     finalRotationY = (targetRotationY - Mesh.rotation.x);
//   if (Mesh.rotation.x <= 1 && Mesh.rotation.x >= -1) {
//     Mesh.rotation.x += finalRotationY * 0.1;
//   }

//   if (Mesh.rotation.x > 1) {
//     Mesh.rotation.x = 1;
//   }

//   if (Mesh.rotation.x < -1) {
//     Mesh.rotation.x = -1;
//   }

//   renderer.render(scene, camera);
// }

// function onWindowResize() {
//   windowHalfX = window.innerWidth / 2;
//   windowHalfY = window.innerHeight / 2;

//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function onDocumentMouseDown(event) {
//   event.preventDefault();

//   document.addEventListener("mousemove", onDocumentMouseMove, false);
//   document.addEventListener("mouseup", onDocumentMouseUp, false);
//   document.addEventListener("mouseout", onDocumentMouseOut, false);

//   mouseXOnMouseDown = event.clientX - windowHalfX;
//   targetRotationOnMouseDownX = targetRotationX;

//   mouseYOnMouseDown = event.clientY - windowHalfY;
//   targetRotationOnMouseDownY = targetRotationY;
// }

// function onDocumentMouseMove(event) {
//   mouseX = event.clientX - windowHalfX;
//   mouseY = event.clientY - windowHalfY;

//   targetRotationY =
//     targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
//   targetRotationX =
//     targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
// }

// function onDocumentMouseUp(event) {
//   document.removeEventListener("mousemove", onDocumentMouseMove, false);
//   document.removeEventListener("mouseup", onDocumentMouseUp, false);
//   document.removeEventListener("mouseout", onDocumentMouseOut, false);
// }

// function onDocumentMouseOut(event) {
//   document.removeEventListener("mousemove", onDocumentMouseMove, false);
//   document.removeEventListener("mouseup", onDocumentMouseUp, false);
//   document.removeEventListener("mouseout", onDocumentMouseOut, false);
// }

// function onDocumentTouchStart(event) {
//   if (event.touches.length == 1) {
//     event.preventDefault();

//     mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
//     targetRotationOnMouseDownX = targetRotationX;

//     mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
//     targetRotationOnMouseDownY = targetRotationY;
//   }
// }

// function onDocumentTouchMove(event) {
//   if (event.touches.length == 1) {
//     event.preventDefault();

//     mouseX = event.touches[0].pageX - windowHalfX;
//     targetRotationX =
//       targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05;

//     mouseY = event.touches[0].pageY - windowHalfY;
//     targetRotationY =
//       targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;
//   }
// }

// init();
// loadGLTF();
// setLight();
// animate();