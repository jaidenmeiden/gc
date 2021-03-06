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
// Global GUI
let effectController;
let ancho = 650, alto = 650;
// Variables globales
let path = "images/";
let ladosCara = altos = [];
let l = b = -70;
let r = t = -l;
let suelo, room, cabeza, cuello, menton, boca, cara, nasal, frontal, paretal, ojos = [], cejas = [], labios;
// Materiales y Texturas
let materialSuelo = [], materiales = [], textures = [];
let inicio, objetos = [], acciones = [];
//Validación
let control = false, posy = [];

// Acciones
init();
loadScene();
render();

let inicia = -205, resta = 282;
inicio = [inicia, false];
objetos[0] = [scene, suelo, inicia -= resta, false];
resta = 66;
objetos[1] = [cabeza, cuello, inicia -= resta, false];
resta = 54;
objetos[2] = [cabeza, menton, inicia -= resta, false];
objetos[3] = [cabeza, boca, inicia -= resta, false];
objetos[4] = [cabeza, cara, inicia -= resta, false];
objetos[5] = [cabeza, nasal, inicia -= resta, false];
objetos[6] = [cabeza, frontal, inicia -= resta, false];
objetos[7] = [cabeza, paretal, inicia -= resta, false];
objetos[8] = [cabeza, null, inicia -= resta, false];
resta = 77;
objetos[9] = [cabeza, null, inicia -= resta, false];
objetos[10] = [cabeza, labios, inicia -= resta, false];
resta = 143;
acciones[0] = [inicia -= resta, false];
resta = 205;
acciones[1] = [inicia -= resta, false];
resta = 334;
acciones[2] = [inicia -= resta, false];
resta = 334;
acciones[3] = [inicia -= resta, false];
resta = 355;
acciones[4] = [inicia -= resta, false];
acciones[5] = [-2773, false];

console.log(objetos);
console.log(acciones);
let rellax = new Rellax('.rellax', {
    // center: true
    callback: function (position) {
        // callback every position change
        //console.log(position);
        if (position.y <= inicio[0] && !inicio[1]) {
            scene.add( new THREE.AxisHelper(100));
            inicio[1] = true;
        }
        for (let i = 0; i < objetos.length; i++) {
            if (position.y <= objetos[i][2] && !objetos[i][3]) {
                console.log(position);
                if (i < 8) {
                    objetos[i][0].add(objetos[i][1]);
                    objetos[i][3] = true;
                } else {
                    if (i === 8) {
                        objetos[i][0].add(ojos[0]);
                        objetos[i][0].add(ojos[1]);
                        objetos[i][3] = true;
                    } else {
                        if (i === 9) {
                            objetos[i][0].add(cejas[0]);
                            objetos[i][0].add(cejas[1]);
                            objetos[i][3] = true;
                        } else {
                            if (i === 10) {
                                objetos[i][0].add(objetos[i][1]);
                                objetos[i][3] = true;
                                objetos[i][3] = true;
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < acciones.length; i++) {
            if (position.y <= acciones[i][0] && !acciones[i][1]) {
                switch (i) {
                    case 0:
                        console.log(position);
                        blackMaterials();
                        updateObjectsMaterials();
                        acciones[i][1] = true;
                        break;
                    case 1:
                        console.log(position);
                        renderer.setClearColor(new THREE.Color("rgb(54,54,53)"));
                        addShadows();
                        acciones[i][1] = true;
                        break;
                    case 2:
                        console.log(position);
                        rebuildMaterials();
                        updateObjectsMaterials();
                        acciones[i][1] = true;
                        break;
                    case 3:
                        generateLights();
                        console.log(position);
                        acciones[i][1] = true;
                        break;
                    case 4:
                        addRoom();
                        console.log(position);
                        acciones[i][1] = true;
                        break;
                    case 5:
                        setupGUI();
                        control = true;
                        console.log(position);
                        acciones[i][1] = true;
                        break;
                    default:
                        break;
                }
            }
        }

    },
    breakpoints: [576, 768, 1024]
});

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(ancho, alto);
    renderer.setClearColor(new THREE.Color("rgb(167,167,167)"));
    renderer.shadowMap.enabled = true;
    document.getElementById('avance').appendChild(renderer.domElement);

    scene = new THREE.Scene();

    let ar = ancho / alto;
    setCameras(ar);

    cameraController = new THREE.OrbitControls( camera, renderer.domElement );
    cameraController.target.set(0,0,0);

    window.addEventListener('resize', updateAspectRatio(ar));
}

function loadScene() {
    // Cargar la escena con objetos
    buildHead();
    generateTextures();
    generateMaterials();
    // Geometrias
    const geosuelo = new THREE.PlaneGeometry(500, 500, 50, 50);
    const geocuello = new THREE.CylinderGeometry(10, 10, altosCara[0], ladosCara[0]);
    const geomenton = new THREE.CylinderGeometry(25, 23, altosCara[1], ladosCara[1]);
    const geoboca = new THREE.CylinderGeometry(25, 25, altosCara[2], ladosCara[1]);
    const geocara = new THREE.CylinderGeometry(24, 24, altosCara[3], ladosCara[1]);
    const geonasal = new THREE.CylinderGeometry(25, 25, altosCara[4], ladosCara[1]);
    const geofrontal = new THREE.CylinderGeometry(20, 24, altosCara[5], ladosCara[2]);
    const geoparetal = new THREE.CylinderGeometry(5, 20, altosCara[6], ladosCara[2]);
    const geopojos = new THREE.SphereGeometry(10, 32, 32);
    const geocejas = new THREE.BoxGeometry(10, 4, 4);
    const geolabios = new THREE.BoxGeometry(17, 2, 2);

    suelo = new THREE.Mesh(geosuelo, materialSuelo[0]);
    suelo.position.set(0,0,0);
    suelo.rotation.x += -1 * Math.PI/2;

    cabeza = new THREE.Object3D();

    let indice = 0;
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

    indice++;
    ojos[0] = new THREE.Mesh(geopojos, materiales[indice]);
    ojos[0].position.set(10,sube - 10, 25);

    ojos[1] = new THREE.Mesh(geopojos, materiales[indice]);
    ojos[1].position.set(25,sube - 10, 10);

    cejas[0] = new THREE.Mesh(geocejas, materiales[indice]);
    cejas[0].rotation.y = Math.PI/4;
    cejas[0].position.set(10,sube + 5, 25);

    cejas[1] = new THREE.Mesh(geocejas, materiales[indice]);
    cejas[1].rotation.y = Math.PI/4;
    cejas[1].position.set(25,sube + 5, 10);
    posy[0] = sube + 5;

    labios = new THREE.Mesh(geolabios, materiales[indice]);
    labios.rotation.y = Math.PI/4;
    labios.position.set(20,sube - 23, 20);
    posy[1] = sube - 23;

    // Construir la escena
    scene.add(cabeza);
}

function update() {
    cameraController.update();

    if (control) {
        cabeza.rotation.y = effectController.giroCabeza * Math.PI / 180;
        ojos[0].position.x = 10 - effectController.ojos;
        ojos[0].position.z = 25 - effectController.ojos;
        ojos[1].position.x = 25 + effectController.ojos;
        ojos[1].position.z = 10 + effectController.ojos;
        cejas[1].position.y = posy[0] + effectController.cejas;
        cejas[0].position.y = posy[0] - effectController.cejas;
        cabeza.rotation.x = effectController.rostro * Math.PI / 90;
        cabeza.rotation.z = effectController.rostro * Math.PI / 90;
        labios.position.y = posy[1] - effectController.boca;
    }
}

function setupGUI() {

    //Interfaz de usuario
    effectController = {
        giroCabeza: 0,
        ojos: 0,
        cejas: 0,
        rostro: 0,
        boca: 0,
        reiniciar: function () {
            angulo = 0
            location.reload();
        },
        color: new THREE.Color("rgb(183, 177, 165)")
    }
    let gui = new dat.GUI({ autoPlace: false });
    let sub = gui.addFolder("Controles Robot")
    sub.add(effectController, "giroCabeza", -180, 180, 1).name("Buscando");
    sub.add(effectController, "ojos", -4, 4, 1).name("Wow");
    sub.add(effectController, "cejas", -4, 4, 1).name("Sorpresa");
    sub.add(effectController, "rostro", -5, 5, 1).name("Saluda");
    sub.add(effectController, "boca", 0, 3, 1).name("Hola");
    sub.add(effectController, "reiniciar");

    let customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(gui.domElement);
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
        camaraOrthographic = new THREE.OrthographicCamera(l*ar, r*ar, t, b, -1000, 1000);
    }
    else{
        camaraOrthographic = new THREE.OrthographicCamera(l, r, t/ar, b/ar, -1000, 1000);
    }

    alzado = camaraOrthographic.clone();
    alzado.position.set(0,0,500);
    alzado.lookAt(origen);
    perfil = camaraOrthographic.clone();
    perfil.position.set(500,0,0);
    perfil.lookAt(origen);
    planta = camaraOrthographic.clone();
    planta.position.set(0,500,0);
    planta.lookAt(origen);

    let cameraPerspective = new THREE.PerspectiveCamera(40, ar, 0.1, 1000);
    cameraPerspective.position.set(300, 100, 300);
    cameraPerspective.lookAt(origen);

    camera = cameraPerspective.clone();

    scene.add(alzado);
    scene.add(perfil);
    scene.add(planta);
    scene.add(camera);
}

function generateLights() {
    let luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(luzAmbiente);

    let luzPuntual = new THREE.PointLight(0xFFFFFF, 0.7);
    luzPuntual.position.set(100, 200, 100);
    scene.add(luzPuntual);

    let luzDireccional = new THREE.DirectionalLight(0xFFFFFF, 0.3);
    luzDireccional.position.set(0, 40, -100);
    scene.add(luzDireccional);

    let luzFocal = new THREE.SpotLight(0xFFFFFF, 1);
    luzFocal.position.set(0, 173, -100);
    luzFocal.target.position.set(0, 0, 0);
    luzFocal.angle = Math.PI / 10;
    luzFocal.penumbra = 0.2;

    luzFocal.shadow.camera.near = 100;
    luzFocal.shadow.camera.far = 1700;
    luzFocal.shadow.camera.fov = 7000;
    luzFocal.shadow.mapSize.width = 500;
    luzFocal.shadow.mapSize.height = 500;

    scene.add(luzFocal.target);
    luzFocal.castShadow = true;
    scene.add(luzFocal);
}

function addRoom() {
    let shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = textures[3];

    let shaderMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        dephtWrite: false,
        side: THREE.BackSide
    });

    room = new THREE.Mesh(new THREE.BoxGeometry(500, 500, 500), shaderMaterial);
    room.position.y += 150;
    scene.add(room);
}

function generateTextures() {
    // Materiales
    let textureLoader = new THREE.TextureLoader();
    textures[0] = textureLoader.load(path + 'floor.jpg');
    textures[0].magFilter = THREE.LinearFilter;
    textures[0].minFilter = THREE.LinearFilter;
    textures[0].repeat.set(3, 2);
    textures[0].wrapS = textures[0].wrapT = THREE.MirroredRepeatWrapping;
    textures[1] = textureLoader.load(path + 'face.jpg');
    textures[2] = textureLoader.load(path + 'newgold.jpg');
    let walls = [path + 'Yokohama/posx.jpg', path + 'Yokohama/negx.jpg',
        path + 'Yokohama/posy.jpg', path + 'Yokohama/negy.jpg',
        path + 'Yokohama/posz.jpg', path + 'Yokohama/negz.jpg'
    ];
    textures[3] = new THREE.CubeTextureLoader().load(walls);
}

function generateMaterials() {
    // Materiales
    materialSuelo[0] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(193, 51, 255)"),
        wireframe:true
    });
    materiales[0] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 64, 0)"),
        wireframe:true
    });
    materiales[1] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 191, 0)"),
        wireframe:true
    });
    materiales[2] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(64, 255, 0)"),
        wireframe:true
    });
    materiales[3] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(0, 128, 255)"),
        wireframe:true
    });
    materiales[4] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 0, 191)"),
        wireframe:true
    });
    materiales[5] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(0, 255, 255)"),
        wireframe:true
    });
    materiales[6] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 255, 0)"),
        wireframe:true
    });
    materiales[7] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 255, 255)"),
        wireframe:true
    });
}

function blackMaterials() {
    // Materiales
    materialSuelo[0] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(0,0,0)"),
        wireframe:true
    });
    for (let i = 0; i < materiales.length; i++) {
        materiales[i] = new THREE.MeshBasicMaterial({
            color: new THREE.Color("rgb(0, 0, 0)"),
            wireframe:true
        });
    }
}

function rebuildMaterials() {
    // Materiales
    materialSuelo[0] = new THREE.MeshLambertMaterial({
        color: "white",
        map: textures[0]
    });
    materiales[0] = new THREE.MeshLambertMaterial({
        color: new THREE.Color("rgb(169, 158, 154)"),
        map: textures[1]
    });
    materiales[1] = new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(169, 158, 154)"),
        specular: new THREE.Color("rgb(143, 134, 135)"),
        shininess: 50,
        wireframe: false,
        map: textures[1]
    });
    materiales[2] = new THREE.MeshLambertMaterial({
        color: new THREE.Color("rgb(184, 150, 61)"),
        map: textures[2]
    });
    materiales[3] = new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(169, 158, 154)"),
        specular: new THREE.Color("rgb(143, 134, 135)"),
        shininess: 50,
        wireframe: false,
        map: textures[1]
    });
    materiales[4] = new THREE.MeshLambertMaterial({
        color: new THREE.Color("rgb(184, 150, 61)"),
        map: textures[2]
    });
    materiales[5] = new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(169, 158, 154)"),
        specular: new THREE.Color("rgb(143, 134, 135)"),
        shininess: 50,
        wireframe: false,
        map: textures[1]
    });
    materiales[6] = new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(169, 158, 154)"),
        specular: new THREE.Color("rgb(143, 134, 135)"),
        shininess: 50,
        wireframe: false,
        map: textures[1]
    });
    materiales[7] = new THREE.MeshLambertMaterial({
        color: new THREE.Color("rgb(112, 7, 7)"),
        wireframe:false
    });
}

function updateObjectsMaterials() {
    suelo.material = materialSuelo[0];
    let indice = 0;
    cuello.material = materiales[indice++];
    menton.material = materiales[indice++];
    boca.material = materiales[indice++];
    cara.material = materiales[indice++];
    nasal.material = materiales[indice++];
    frontal.material = materiales[indice++];
    paretal.material = materiales[indice++];
    ojos[0].material = materiales[indice];
    ojos[1].material = materiales[indice];
    cejas[0].material = materiales[indice];
    cejas[1].material = materiales[indice];
    labios.material = materiales[indice];
}

function addShadows() {
    suelo.receiveShadow = true;
    cuello.receiveShadow = true;
    cuello.castShadow = true;
    menton.receiveShadow = true;
    menton.castShadow = true;
    boca.receiveShadow = true;
    boca.castShadow = true;
    cara.receiveShadow = true;
    cara.castShadow = true;
    nasal.receiveShadow = true;
    nasal.castShadow = true;
    frontal.receiveShadow = true;
    frontal.castShadow = true;
    paretal.receiveShadow = true;
    paretal.castShadow = true;
    ojos[0].receiveShadow = true;
    ojos[0].castShadow = true;
    ojos[1].receiveShadow = true;
    ojos[1].castShadow = true;
    cejas[0].receiveShadow = true;
    cejas[0].castShadow = true;
    cejas[1].receiveShadow = true;
    cejas[1].castShadow = true;
    labios.receiveShadow = true;
    labios.castShadow = true;
}

function buildHead() {
    altosCara = [10, 3, 5, 14, 3, 3, 4];
    ladosCara = [50, 20, 30];
}

function updateAspectRatio(ar)
{
    renderer.setSize(ancho, alto);

    if(ar > 1){
        alzado.left = perfil.left = planta.left = l * ar;
        alzado.right = perfil.right = planta.right = r * ar;
        alzado.top = perfil.top = planta.top = t;
        alzado.bottom = perfil.bottom = planta.bottom = b;
    }
    else{
        alzado.left = perfil.left = planta.left = l;
        alzado.right = perfil.right = planta.right = r;
        alzado.top = perfil.top = planta.top = t/ar;
        alzado.bottom = perfil.bottom = planta.bottom = b/ar;
    }

    camera.aspect = ar;
    camera.updateProjectionMatrix();
}