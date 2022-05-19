import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { InteractionManager } from './THREE.Interactive-master/build/three.interactive';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl';
import { Mesh, Raycaster } from 'three';
import * as throttle from 'lodash.throttle';



//VVVVVVVV UI for the control console 
/*
var gui = new dat.GUI();
var canvas = {
    sphere: {
        radius: 5
    }
}
gui.add(canvas.sphere, 'radius', 1, 100).onChange(() => {
    sphereMesh.geometry.dispose();
    sphereMesh.geometry = new THREE.SphereGeometry(canvas.sphere.radius)
    console.log(canvas.sphere.radius);
    
});
*/



//VVVVV creating the variables for the canvas --- scene, camera [position relative to the screen], and a renderer for the 3D objects
//var throttle = require('lodash.throttle');

var raycaster = new THREE.Raycaster();
console.log(raycaster);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

//RENDERER
var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,   
    canvas: document.querySelector('canvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


//ORBIT CONTROLS
var controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 1;
controls.maxDistance = 1000;


//LIGHT
/*var sunLight = new THREE.DirectionalLight(new Color('#FFFFFF'), 3.5);
sunLight.position.set(10, 20, 30);
sunLight.castShadow = true;
scene.add(sunLight);
*/

var light = new THREE.AmbientLight(0x404040, 5);
scene.add(light);

//3D OBJECTS
var glLoader = new GLTFLoader();

var indietopiaFoundationText;
var indietopiaFoundationLogo;
var bVText;
var bVLogo;
var fabLabText;
var fabLabLogo;


glLoader.load("./objects/Indietopia_Text.glb", function(gltf){
    indietopiaFoundationText = gltf.scene
    scene.add(gltf.scene)
    indietopiaFoundationText.position.y = -20
   

});

glLoader.load("./objects/Indietopia_Logo.glb", function(gltf){
    indietopiaFoundationLogo = gltf.scene
    scene.add(gltf.scene)
    indietopiaFoundationLogo.position.y = -5
   

})

glLoader.load("./objects/Digitopia_Text.glb", function(gltf){
    bVText = gltf.scene
    scene.add(gltf.scene)
    bVText.position.y = -20
    bVText.position.x = -25
   

})

glLoader.load("./objects/DigitopiaLogo.glb", function(gltf){
    bVLogo = gltf.scene
    scene.add(gltf.scene)
    bVLogo.position.y = -5
    bVLogo.position.x = -25
   

})

glLoader.load("./objects/Fablab_Text.glb", function(gltf){
    fabLabText = gltf.scene
    scene.add(gltf.scene)
    fabLabText.position.y = -20
    fabLabText.position.x = 25.5
   
})

glLoader.load("./objects/Fablab_Logo.glb", function(gltf){
    fabLabLogo = gltf.scene
    scene.add(gltf.scene)
    fabLabLogo.position.y = -5.5
    fabLabLogo.position.x = 25.5
   
})




//VVVVV creating the sphere mesh
var indietopiaFoundation = new THREE.Mesh(new THREE.SphereGeometry(5, 30, 30), new THREE.ShaderMaterial({
   vertexShader, 
   fragmentShader,
   //UNIFORM IS USED TO PASS THE UV IMAGE TO THE FRAGMENT SHADER IN ORDER TO LOAD IT VVVVV
   uniforms: {
       globeTexture: {
           value: new THREE.TextureLoader().load('/images/Tropical.png')
       }
   }
}));

indietopiaFoundation.receiveShadow = true;

var indietopiaBv = new THREE.Mesh(new THREE.SphereGeometry(5, 30, 30), new THREE.MeshBasicMaterial({
    //color: 0xFF0010
    map: new THREE.TextureLoader().load('./images/Alpine.png')
}));

var indietopiaFabLab = new THREE.Mesh(new THREE.SphereGeometry(5, 30, 30), new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('./images/Icy.png')
}));


//ATMOSPHERE IS BASICALLY ANOTHER SPHERE ON TOP OF THE GLOBE TO ACT AS A SECOND LAYER AND TO MIMIC ACTUAL ATMOSPHERE
var indietopiaFoundationAtmosphere = new THREE.Mesh(new THREE.SphereGeometry(5, 30, 30), new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
 }));

indietopiaFoundationAtmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(indietopiaFoundationAtmosphere);


//ADDING PLANETS TO THE SCENE 
//var group = new THREE.Group();
scene.add(indietopiaFoundation);
scene.add(indietopiaBv);
scene.add(indietopiaFabLab);
//scene.add(group);

//INTERACTION MANAGER
var interactionManager = new InteractionManager(renderer, camera, renderer.domElement);
interactionManager.add(indietopiaFoundation);
interactionManager.add(indietopiaBv);
interactionManager.add(indietopiaFabLab);


//position of the planets
indietopiaBv.position.x = -25;
indietopiaFabLab.position.x = 25;


//FUNCTIONS

var mouse = {
    x: undefined,
    y: undefined,
}

//REAL TIME ANIMATION
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    indietopiaFoundation.rotation.y += 0.001;
    indietopiaBv.rotation.y -= 0.001;
    indietopiaFabLab.rotation.y += 0.001;
    //group.rotation.y = mouse.x * 0.5;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(indietopiaFoundation);
    if (intersects.length > 0) {

    }

    interactionManager.update();
    
}
animate();


(async function() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
})();



//This function makes the canvas look good on high pixel ratio devices 
function setCanvasDimensions (canvas, width, height, set2dTransform = false) {
    var ratio = window.devicePixelRatio;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = '${width}px';
    canvas.style.height = '${height}px';
    if (set2dTransform) {
        canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
    }
}


//EVENTLISTENERS


//RESIZING OF THE CANVAS SO THAT IT FITS MOBILE DEVICES 
var resizeUpdateInterval = 500;

window.addEventListener(
  'resize',
  throttle(
    () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      setCanvasDimensions(renderer.domElement, width, height);
    },
    resizeUpdateInterval,
    { trailing: true }
  )
);

//NORMALIZING MOUSE COORDINATES 
addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});



//INDIETOPIAFOUNDATION PLANET EVENTLISTENERS

var modalFoundation = document.getElementById('modal-foundation');

function openModalFoundation(modalFoundation) {
    if (modalFoundation == null) return
    modalFoundation.classList.add('active')
    overlay.classList.add('active')
};

indietopiaFoundation.addEventListener('mouseover', event => {
    event.target.scale.set(1.2, 1.2, 1.2)
});

indietopiaFoundation.addEventListener('mouseout', event => {
    event.target.scale.set(1, 1, 1)
});

indietopiaFoundation.addEventListener('click', event => {
   openModalFoundation(modalFoundation)
});


//INDIETOPIABV PLANET EVENTLISTENERS

var modalBv = document.getElementById('modal-bv');

function openModalBv(modalBv) {
    if (modalBv == null) return
    modalBv.classList.add('active')
    overlay.classList.add('active')
};

indietopiaBv.addEventListener('mouseover', event => {
    event.target.scale.set(1.2, 1.2, 1.2)
});

indietopiaBv.addEventListener('mouseout', event => {
    event.target.scale.set(1, 1, 1)
});

indietopiaBv.addEventListener('click', event => {
    openModalBv(modalBv)
 });
 
//INDIETOPIAFABLAB PLANET EVENTLISTENERS

var modalFabLab = document.getElementById('modal-fablab');

function openModalFabLab(modalFabLab) {
    if (modalFabLab == null) return
    modalFabLab.classList.add('active')
    overlay.classList.add('active')
};

indietopiaFabLab.addEventListener('mouseover', event => {
    event.target.scale.set(1.2, 1.2, 1.2)
});

indietopiaFabLab.addEventListener('mouseout', event => {
    event.target.scale.set(1, 1, 1)
});

indietopiaFabLab.addEventListener('click', event => {
    openModalFabLab(modalFabLab)
});



//HTML JAVASCRIPT

var closeModalButton = document.querySelectorAll('[data-close-button]');
var overlay = document.getElementById('overlay');
var goToFoundation = document.getElementById('foundation-link-button');
var goToBv = document.getElementById('bv-link-button');
var goToFabLab = document.getElementById('fablab-link-button');

goToFoundation.addEventListener('click', event => {
    window.open('https://indietopia.org/about-us/');
})

goToBv.addEventListener('click', event => {
    window.open('https://indietopia.org/about-us/');
})

goToFabLab.addEventListener('click', event => {
    window.open('https://www.fablabgroningen.nl/en/7181-2/');
})

closeModalButton.forEach(button => {
    button.addEventListener('click', () => {
        var modal = button.closest('.modal')
        closeModal(modal)
    })
});

//FUNCTION TO CLOSE THE MODAL
function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
};




