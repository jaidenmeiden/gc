/**
 *	Proyecto Final
 *
 *	Se construye un portal didáctico e interactivo para enseñar como iniciar
 *	con el desarrollo de proyectos de realizad virtual	a personas que
 *	comienzan su carrera en el mundo de la IA.
 *
 */

// Variables imprescindibles
let renderer, scene, camera;
let cameraController;
let alzado, planta, perfil;
let angulo = 0, ancho = 650, alto = 650;
// Variables globales
let path = "images/";
let ladosCara = altos = [];
let l = b = -4;
let r = t = -l;
let room, cabeza, cuello, menton, boca, cara, nasal, frontal, paretal;
// Materiales y Texturas
let materiales = [], textures = [];
let controles = [];
let inicia = -227, resta = 54;
controles[0] = [inicia, false];
controles[1] = [inicia -= resta, false];
controles[2] = [inicia -= resta, false];
controles[3] = [inicia -= resta, false];
controles[4] = [inicia -= resta, false];
controles[5] = [inicia -= resta, false];
controles[6] = [inicia -= resta, false];

console.log(controles);

// Acciones
init();
loadScene();
render();

let rellax = new Rellax('.rellax', {
    // center: true
    callback: function (position) {
        // callback every position change
        console.log(position);
        if (position.y <= controles[0][0] && !controles[0][1]) {
            cabeza.add(cuello);
            controles[0][1] = true;
        }
        if (position.y <= controles[1][0] && !controles[1][1]) {
            cabeza.add(menton);
            controles[1][1] = true;
        }
        if (position.y <= controles[2][0] && !controles[2][1]) {
            cabeza.add(boca);
            controles[2][1] = true;
        }
        if (position.y <= controles[3][0] && !controles[3][1]) {
            cabeza.add(cara);
            controles[3][1] = true;
        }
        if (position.y <= controles[4][0] && !controles[4][1]) {
            cabeza.add(nasal);
            controles[4][1] = true;
        }
        if (position.y <= controles[5][0] && !controles[5][1]) {
            cabeza.add(frontal);
            controles[5][1] = true;
        }
        if (position.y <= controles[6][0] && !controles[6][1]) {
            cabeza.add(paretal);
            rebuildMaterials();
            updateObjectsMaterials();
            controles[6][1] = true;
        }
    },
    breakpoints: [576, 768, 1024]
});

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(ancho, alto);
    renderer.setClearColor(new THREE.Color(0x363635));
    document.getElementById('avance').appendChild(renderer.domElement);

    scene = new THREE.Scene();

    let ar = ancho / alto;
    setCameras(ar);

    // Controlador de camara
    cameraController = new THREE.OrbitControls( camera, renderer.domElement );
    cameraController.target.set(0,0,0);
}

function loadScene() {
    // Cargar la escena con objetos
    buildHead();
    generateTextures();
    generateMaterials();
    // Geometrias
    const geocuello = new THREE.CylinderGeometry(10, 10, altosCara[0], ladosCara[0]);
    const geomenton = new THREE.CylinderGeometry(25, 23, altosCara[1], ladosCara[1]);
    const geoboca = new THREE.CylinderGeometry(25, 25, altosCara[2], ladosCara[1]);
    const geocara = new THREE.CylinderGeometry(24, 24, altosCara[3], ladosCara[1]);
    const geonasal = new THREE.CylinderGeometry(25, 25, altosCara[4], ladosCara[1]);
    const geofrontal = new THREE.CylinderGeometry(20, 24, altosCara[5], ladosCara[2]);
    const geoparetal = new THREE.CylinderGeometry(5, 20, altosCara[6], ladosCara[2]);

    let indice = 0;
    cabeza = new THREE.Object3D();

    let sube = altosCara[indice]/2;
    cuello = new THREE.Mesh(geocuello, materiales[indice]);
    cuello.position.set(0,sube,0);

    indice++;
    sube += altosCara[indice - 1]/2 + altosCara[indice]/2;
    menton = new THREE.Mesh(geomenton, materiales[indice]);
    menton.position.set(0,sube,0);

    indice++;
    sube += altosCara[indice - 1]/2 + altosCara[indice]/2;
    boca = new THREE.Mesh(geoboca, materiales[indice]);
    boca.position.set(0,sube,0);

    indice++;
    sube += altosCara[indice - 1]/2 + altosCara[indice]/2;
    cara = new THREE.Mesh(geocara, materiales[indice]);
    cara.position.set(0,sube,0);

    indice++;
    sube += altosCara[indice - 1]/2 + altosCara[indice]/2;
    nasal = new THREE.Mesh(geonasal, materiales[indice]);
    nasal.position.set(0,sube,0);

    indice++;
    sube += altosCara[indice - 1]/2 + altosCara[indice]/2;
    frontal = new THREE.Mesh(geofrontal, materiales[indice]);
    frontal.position.set(0,sube,0);

    indice++;
    sube += altosCara[indice - 1]/2 + altosCara[indice]/2;
    paretal = new THREE.Mesh(geoparetal, materiales[indice]);
    paretal.position.set(0,sube,0);

    // Construir la escena
    scene.add(cabeza);
    scene.add( new THREE.AxisHelper(100));
}

function update() {
    cameraController.update();
    angulo += Math.PI/1000;
    //cabeza.rotation.y = angulo;
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}

function setCameras(ar){
    let origen = new THREE.Vector3(0,0,0);

    let camaraOrthographic;
    if(ar > 1){
        camaraOrthographic = new THREE.OrthographicCamera(l*ar, r*ar, t, b, -500, 500);
    }
    else{
        camaraOrthographic = new THREE.OrthographicCamera(l, r, t/ar, b/ar, -500, 500);
    }

    alzado = camaraOrthographic.clone();
    alzado.position.set(0,0,100);
    alzado.lookAt(origen);
    perfil = camaraOrthographic.clone();
    perfil.position.set(100,0,0);
    perfil.lookAt(origen);
    planta = camaraOrthographic.clone();
    planta.position.set(0,100,0);
    planta.lookAt(origen);

    let cameraPerspective = new THREE.PerspectiveCamera(150, ar, 0.1, 1000);
    cameraPerspective.position.set(30, 30, 30);
    cameraPerspective.lookAt(origen);

    camera = cameraPerspective.clone();

    //scene.add(alzado);
    //scene.add(perfil);
    //scene.add(planta);
    scene.add(camera);
}

function generateTextures() {
    // Materiales
    let textureLoader = new THREE.TextureLoader()
    textures[0] = textureLoader.load(path + 'wood.jpg');
    textures[0].magFilter = THREE.LinearFilter;
    textures[0].minFilter = THREE.LinearFilter;
    textures[0].repeat.set(4, 3);
    textures[0].wrapS = textures[0].wrapT = THREE.MirroredRepeatWrapping;
    textures[1] = textureLoader.load(path + 'oxidado.jpg');
    let walls = [path + 'Yokohama/posx.jpg', path + 'Yokohama/negx.jpg',
        path + 'Yokohama/posy.jpg', path + 'Yokohama/negy.jpg',
        path + 'Yokohama/posz.jpg', path + 'Yokohama/negz.jpg'
    ];
    textures[2] = new THREE.CubeTextureLoader().load(walls);
    textures[3] = textureLoader.load(path + 'gold.jpg');
}

function generateMaterials() {
    // Materiales
    materiales[0] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(193, 51, 255)"),
        wireframe:true
    });
    materiales[1] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 64, 0)"),
        wireframe:true
    });
    materiales[2] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 191, 0)"),
        wireframe:true
    });
    materiales[3] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(64, 255, 0)"),
        wireframe:true
    });
    materiales[4] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(0, 128, 255)"),
        wireframe:true
    });
    materiales[5] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 0, 191)"),
        wireframe:true
    });
    materiales[6] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(0, 255, 255)"),
        wireframe:true
    });
    materiales[7] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 255, 0)"),
        wireframe:true
    });
    materiales[8] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 255, 255)"),
        wireframe:true
    });
}

function rebuildMaterials() {
    // Materiales
    materiales[0] = new THREE.MeshLambertMaterial({
        color: new THREE.Color("rgb(220, 172, 74)"),
        map: textures[1]
    });
    materiales[1] = new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(122, 49, 19)"),
        specular: new THREE.Color("rgb(214, 175,58)"),
        shininess: 50,
        wireframe: false,
        map: textures[1]
    });
    materiales[2] = new THREE.MeshLambertMaterial({
        color: new THREE.Color("rgb(220, 172, 74)"),
        map: textures[3]
    });
    materiales[3] = new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(122, 49, 19)"),
        specular: new THREE.Color("rgb(214, 175,58)"),
        shininess: 50,
        wireframe: false,
        map: textures[1]
    });
    materiales[4] = new THREE.MeshLambertMaterial({
        color: new THREE.Color("rgb(220, 172, 74)"),
        map: textures[3]
    });
    materiales[5] = new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(122, 49, 19)"),
        specular: new THREE.Color("rgb(214, 175,58)"),
        shininess: 50,
        wireframe: false,
        map: textures[1]
    });
    materiales[6] = new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(122, 49, 19)"),
        specular: new THREE.Color("rgb(214, 175,58)"),
        shininess: 50,
        wireframe: false,
        map: textures[1]
    });
    materiales[7] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 255, 0)"),
        wireframe:true
    });
    materiales[8] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 255, 255)"),
        wireframe:true
    });
}

function updateObjectsMaterials() {
    let indice = 0;
    cuello.material = materiales[indice++];
    menton.material = materiales[indice++];
    boca.material = materiales[indice++];
    cara.material = materiales[indice++];
    nasal.material = materiales[indice++];
    frontal.material = materiales[indice++];
    paretal.material = materiales[indice++];
}

function buildHead() {
    altosCara = [10, 3, 5, 14, 3, 3, 4];
    ladosCara = [50, 20, 30];
}