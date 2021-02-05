// Create scene
var scene = new THREE.Scene();

// Create camera
var camera = new THREE.PerspectiveCamera(
    75,     // fov - Camera frustum vertical field of view
    window.innerWidth / window.innerHeight, // aspect - Camera frustum aspect ratio
    0.1,   // near - Camera frustum near plane
    5000); // far - Camera frustum far plane
// Far clipping plane above will not work, because skybox is 5000x5000x5000. Try 2500

// Create renderer
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create geometry
var geometry = new THREE.SphereGeometry(1, 32, 24);
normalMap = THREE.ImageUtils.loadTexture("earth_normal.jpg");
colorMap = THREE.ImageUtils.loadTexture("earth.jpg");
var material = new THREE.MeshPhongMaterial({ map: colorMap, normalMap: normalMap });
var earth = new THREE.Mesh(geometry, material);
scene.add(earth);

eartcontrols = new THREE.OrbitControls(earth, renderer.domElement);
eartcontrols.autoRotate = true;
eartcontrols.autoRotateSpeed = 1;


//var directions = ["posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"];
var directions = ["posx.png", "negx.png", "posy.png", "negy.png", "posz.png", "negz.png"];
var materialArray = [];
for (var i = 0; i < 6; i++) {
    materialArray.push(
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(directions[i]),
            side: THREE.BackSide
        })
    );
}

var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000);
var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skyBox);

// Define light
var ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

var light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(-30, 2, 10);
scene.add(light);

// Move camera from center
camera.position.x = 2;  // Move right from center of scene
camera.position.y = 1;  // Move up from center of scene
camera.position.z = 5;  // Move camera away from center of scene

// Import camera control and rotation library
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.noKeys = false;
controls.keys = { LEFT: 65, UP: 81, RIGHT: 68, BOTTOM: 69 };


document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 32) {
        camera.position.set(2, 1, 5);
    }
};

var render = function () {
    requestAnimationFrame(render);
    if(camera.position.y < -100)
    {
        camera.position.y = -100;
    }
    controls.update();
    renderer.render(scene, camera);
}

render();
