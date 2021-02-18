// Create scene
const scene = new THREE.Scene();

// Create CubeTextureLoader
const loader = new THREE.CubeTextureLoader();

// Create renderer
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create camera
var camera = new THREE.PerspectiveCamera(
    75,     // fov - Camera frustum vertical field of view
    window.innerWidth / window.innerHeight, // aspect - Camera frustum aspect ratio
    0.1,   // near - Camera frustum near plane
    5000); // far - Camera frustum far plane
// Far clipping plane above will not work, because skybox is 5000x5000x5000. Try 2500



// Import camera control and rotation library
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.noKeys = false;
controls.keys = { LEFT: 65, UP: 81, RIGHT: 68, BOTTOM: 69 };

function onZoomIn() {
    controls.zoomIn();
}

function onZoomOut() {
    controls.zoomOut();
}

// Move camera from center
camera.position.x = 2;  // Move right from center of scene
camera.position.y = 1;  // Move up from center of scene
camera.position.z = 5;  // Move camera away from center of scene
controls.update();


document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    switch (keyCode)
    {
        case 32:
            camera.position.set(2, 1, 5);
            controls.update();
            break;
        // case 65: //LEFT
        //     camera.position.x--;
        //     controls.update();
        //     break;
        // case 68: //RIGHT
        //     camera.position.x++;
        //     controls.update();
        //     break;
        case 87: //ZOOM IN
            onZoomIn();
            break;
        case 83: //ZOOM OUT
            onZoomOut();

            break;
        default:
            break;
    }
};




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

// CREATE SATELLITE
var satellites = [];

var createSatellite = function(_position, _rotation, _scale)
{
    
    const pipeG = new THREE.CylinderGeometry( .1, .1, 5, 32);
    var pipeM = new THREE.MeshPhongMaterial({envMap: skyTexture, color: 0xAAAAAA, combine: THREE.MixOperation});
    var pipe = new THREE.Mesh(pipeG, pipeM);
    //scene.add(pipe);
    pipe.position.copy(_position);
    pipe.quaternion.copy(_rotation);
    pipe.scale.copy(_scale);
    pipe.rotation.z += .5 * Math.PI;
    pipe.updateMatrix();


    const baseG = new THREE.CylinderGeometry( .1, 1, 5, 32 );
    var baseM = new THREE.MeshPhongMaterial({envMap: skyTexture, color: 0xAAAAAA, combine: THREE.MixOperation});
    var base = new THREE.Mesh(baseG, baseM);
    //scene.add(base);
    base.position.copy( _position);
    base.quaternion.copy(_rotation);
    base.scale.copy(_scale);
    base.updateMatrix();

    const topG = new THREE.ConeGeometry( .2, 2, 32 );
    var topM = new THREE.MeshPhongMaterial({color: 0x000000});
    var top = new THREE.Mesh(topG, topM);
    //scene.add(top);
    top.position.copy(_position);
    top.quaternion.copy(_rotation);
    top.scale.copy(_scale);
    top.position.y += 2.5;
    top.updateMatrix();
    
    var materials = [pipeM, baseM, topM];
    
    var satelliteG = new THREE.Geometry();
    satelliteG.merge(pipe.geometry, pipe.matrix, 0);
    satelliteG.merge(base.geometry, base.matrix, 1);
    satelliteG.merge(top.geometry, top.matrix, 2);
    var satellite = new THREE.Mesh(satelliteG, materials);

    satellite.scale.set(0.5,0.5,0.5);
	scene.add(satellite);

    satellites.push(satellite);
}

const position = new THREE.Vector3( 5, 0, 0 );
const rotation = new THREE.Quaternion();
const scale = new THREE.Vector3(1,1,1);

createSatellite(position, rotation, scale);

// Define light
var ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

var light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(-30, 2, 10);
scene.add(light);

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
