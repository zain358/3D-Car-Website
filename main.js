const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-space').appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Use ACES Filmic tone mapping for better visual balance
renderer.toneMappingExposure = 1.5; // Adjust exposure to prevent overexposure on brighter screens
let car;
const loader = new THREE.GLTFLoader();

let targetScale = 0.6; // Final scale value
let scaleSpeed = 0.05; // Speed of scaling
let arrived = false; // Control when scaling is complete


// Load Porsche
loader.load('./porsche.glb', function (gltf) {
    car = gltf.scene;
    car.scale.set(0, 0, 0); // Initially, the car is scaled to 0
    car.position.set(0.9, 0.5, 2); // Set car's position
    car.rotation.set(0, Math.PI / 3, 0);
    scene.add(car);

    // Enable shadows on meshes
    car.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;

            // Enhance material visuals
            if (node.material) {
                node.material.metalness = 0.6;
                node.material.roughness = 0.3;
            }
        }
    });

    if (window.innerWidth < 968) {
        car.position.set(1.1, 1, 2);
        targetScale = 0.5
    } else {
        car.position.set(1.1, 0.5, 2);
        targetScale = 0.6
    }

}, undefined, function (error) {
    console.error(error);
});

scene.background = new THREE.Color(0x050505);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // A bit softer ambient light
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 3); // Reduce directional light intensity
dirLight.position.set(3, 5, 14);
dirLight.castShadow = true;
scene.add(dirLight);

const spotLight = new THREE.SpotLight(0xffffff, 3); // Reduce spotlight intensity
spotLight.position.set(31, 23, 12);
spotLight.angle = Math.PI / 3;
spotLight.penumbra = 1.4;
spotLight.castShadow = true;
scene.add(spotLight);

// CAMERA position
camera.position.set(2, 1, 4);
camera.lookAt(0, 0, 0);
dirLight.shadow.mapSize.width = 4096; // Increase shadow map width
dirLight.shadow.mapSize.height = 4096; // Increase shadow map height

spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
// Animation variables
let lastTime = 0;

let rotationSpeed = 0.002; // Adjust speed of rotation
let maxRotation = Math.PI / 3; // 90 degrees to the right
let minRotation = -Math.PI / 9; // 90 degrees to the left
let rotationDirection = 1; // 1 for rotating right, -1 for rotating left


// ANIMATE
function animate(time) {
    requestAnimationFrame(animate);

    // Calculate deltaTime (time between frames in seconds)
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    if (car) {
        if (car.rotation.y > maxRotation) {
            rotationDirection = -0.5; // Change direction to left
        } else if (car.rotation.y < minRotation) {
            rotationDirection = 0.5; // Change direction to right
        }
        car.rotation.y += rotationSpeed * rotationDirection;

        // Smoothly scale the car from 0 to 0.6
        if (car.scale.x < targetScale) {
            const scaleStep = scaleSpeed * deltaTime * 3; // Ensure smooth scaling for 60 FPS
            car.scale.set(
                Math.min(car.scale.x + scaleStep, targetScale), // Scale the x-axis smoothly
                Math.min(car.scale.y + scaleStep, targetScale), // Scale the y-axis smoothly
                Math.min(car.scale.z + scaleStep, targetScale)  // Scale the z-axis smoothly
            );
        }
        if (window.innerWidth < 1968) {
            car.position.set(1.9, 0.5, 1.3);
            targetScale = 0.5
        }
        if (window.innerWidth < 1468) {
            car.position.set(1.8, 0.4, 1.7);
            targetScale = 0.4
        }
        if (window.innerWidth < 968) {
            car.position.set(0.7, 0.8, 1.3);
            targetScale = 0.5
        } 
    }

    renderer.render(scene, camera);
}

// Resize event listener
window.addEventListener('resize', () => {
    // Update camera aspect ratio and projection matrix
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // Adjust car position based on window size

    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

// Handle Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger-menu');
const nav = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active'); // Toggle the 'active' class for hamburger animation
});