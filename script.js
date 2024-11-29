const startCameraButton = document.getElementById('start-camera');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
let renderer, scene, camera, model, loader;

// Model buttons and sliders
const model1Button = document.getElementById('model1');
const model2Button = document.getElementById('model2');
const scaleSlider = document.getElementById('scale-slider');
const positionXSlider = document.getElementById('position-x-slider');
const positionYSlider = document.getElementById('position-y-slider');

startCameraButton.addEventListener('click', startCamera);
model1Button.addEventListener('click', () => loadModel('cube'));
model2Button.addEventListener('click', () => loadModel('flowerpot'));
scaleSlider.addEventListener('input', updateModelTransform);
positionXSlider.addEventListener('input', updateModelTransform);
positionYSlider.addEventListener('input', updateModelTransform);

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
            initThreeJS();
        })
        .catch((err) => {
            console.error('Error accessing the camera: ', err);
        });
}

function initThreeJS() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    loader = new THREE.GLTFLoader();
    loadModel('flowerpot');

    animate();
}

function loadModel(type) {
    if (model) {
        scene.remove(model);
    }

    if (type === 'cube') {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        model = new THREE.Mesh(geometry, material);
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        scene.add(model);
    } else if (type === 'flowerpot') {
        const modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/FlowerPot/glTF/FlowerPot.gltf';
        loader.load(modelUrl, function (gltf) {
            model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5);
            model.position.set(0, -1, 0);
            scene.add(model);
        });
    }
    updateModelTransform();
}

function updateModelTransform() {
    if (model) {
        model.scale.set(scaleSlider.value, scaleSlider.value, scaleSlider.value);
        model.position.set(positionXSlider.value, positionYSlider.value, 0);
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}
