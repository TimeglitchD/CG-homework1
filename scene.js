// Create scene
const scene = new THREE.Scene();

const loader = new THREE.CubeTextureLoader();

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


// Create skybox
var directions = ["posx.png", "negx.png", "posy.png", "negy.png", "posz.png", "negz.png"];
var skyMaterial = [];
for (var i = 0; i < 6; i++) {
    skyMaterial.push(
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(directions[i]),
            side: THREE.BackSide
        })
    );
}

skyTexture = loader.load(["posx.png", "negx.png", "posy.png", "negy.png", "posz.png", "negz.png"]);

var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000);
var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skyBox);

// Create geometry for earth
var earthGeometry = new THREE.SphereGeometry(1, 32, 24);
var earthNormalMap = new THREE.TextureLoader().load("earth_normal.jpg");
var earthColorMap = new THREE.TextureLoader().load("earth.jpg");
var earthMaterial = new THREE.MeshPhongMaterial({ map: earthColorMap, normalMap: earthNormalMap });
var earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Create cylinder

var cylinderGeometry = new THREE.CylinderGeometry( 1, 1, 20, 32 );
var cylinderMaterial = new THREE.MeshPhongMaterial({envMap: skyTexture, color: 0xAAAAAA, combine: THREE.MixOperation});
var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
scene.add(cylinder);
cylinder.position.x = 5;


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
    //rotate earth around y axis and slightly around x axis
    var time = Date.now() * 0.0001;
	earth.rotation.x = Math.sin(time*0.5) * 0.5;
	earth.rotation.y = Math.PI * time;
    controls.update();
    renderer.render(scene, camera);
}

render();
