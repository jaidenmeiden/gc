/**
 *	Seminario GPC #2. FormaBasica
 *	Dibujar formas basicas con animacion
 *
 */

// Variables imprescindibles
let renderer, scene, camera;

// Variables globales
let suelo, robot, base;
let brazo, eje, esparrago, rutula;
let antebrazo, disco, nervios = [];
let mano, pinzalIz, pinzalDe;
let x = [1, 1, -1, -1], z = [-1, 1, 1, -1], material = [], angulo = 0;

// Acciones
init();
loadScene();
render();

function init() {
    // Crear el motor, la escena y la camara

    // Motor de render
    renderer = new THREE.WebGLRenderer();
    //Tamaño dela area donde vamos a dibujar
    renderer.setSize(window.innerWidth,window.innerHeight);
    //Color con el que se formatea el contenedor
    renderer.setClearColor(new THREE.Color(0x0000AA));
    //Agregamos el elemento canvas de renderer al contenedor
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camara
    let ar = window.innerWidth / window.innerHeight;// Razón de aspecto
    camera = new THREE.PerspectiveCamera( 40, ar, 0.1, 7000); // Inicializa camara (Angulo, razón de aspecto, Distancia con efecto, Distancia sin efecto)
    scene.add(camera);//Agregamos la camara a la escena
    // Posición e la camara (Diferente a la posición  defecto)
    camera.position.set(0,500,0);
    //camera.position.set(500,0,500);
    //camera.position.set(500,500,500);
    camera.lookAt(new THREE.Vector3(0,0,0)); // A donde esta mirando la cámara
}

function loadScene() {
    // Cargar la escena con objetos
    generateMaterials();
    // Geometrias
    var geosuelo = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    var geobase = new THREE.CylinderGeometry(50, 50, 15, 50);
    var geoeje = new THREE.CylinderGeometry(20, 20, 18, 40);
    var geoesparrago = new THREE.BoxGeometry(18, 120, 12);
    var georotula = new THREE.SphereGeometry(20, 32, 32);
    var geodisco = new THREE.CylinderGeometry(22, 22, 6, 40);
    var geonervios = new THREE.BoxGeometry(4, 80, 4);
    var geomano = new THREE.CylinderGeometry(15, 15, 40, 40);
    var geopalma = new THREE.BoxGeometry(19, 20, 4);

    // Objetos
    suelo = new THREE.Mesh(geosuelo, material[0]);
    suelo.rotation.x += Math.PI/2;
    suelo.rotation.z += Math.PI/4;

    //Objeto robot (Add: base)
    robot = new THREE.Object3D();

    //Objeto base (Add: brazo)
    base = new THREE.Mesh(geobase, material[1]);
    base.position.y += 7.5;

    //Objeto brazo (Add: eje + esparrago + rotula + antebrazo)
    brazo = new THREE.Object3D();

    //Objeto eje
    eje = new THREE.Mesh(geoeje, material[2]);
    eje.rotation.x = Math.PI/2;

    //Objeto esparrago
    esparrago = new THREE.Mesh(geoesparrago, material[3]);
    esparrago.position.y += 60;

    //Objeto rotula
    rotula = new THREE.Mesh(georotula, material[4]);
    rotula.position.y += 120;

    //Objeto antebrazo (Add: disco + nervios + mano)
    antebrazo = new THREE.Object3D();
    antebrazo.position.y += 120;

    //Objeto disco
    disco = new THREE.Mesh(geodisco, material[5]);

    //Objeto disco
    for (let i = 0; i < 4; i++) {
        nervios[i] = new THREE.Mesh(geonervios, material[6]);
        nervios[i].position.y += 40;
        nervios[i].position.x += x[i] * (22/2 - 2);
        nervios[i].position.z += z[i] * (22/2 - 2);
    }

    //Objeto mano
    mano = new THREE.Mesh(geomano, material[7]);
    mano.position.y += 80;
    mano.rotation.x = Math.PI/2;

    //Objeto pinzas
    pinzalIz = new THREE.Mesh(geopalma, material[8]);
    pinzalIz.position.x += 20;
    pinzalIz.position.y += 10;//Con respecto a mano
    pinzalIz.rotation.x = Math.PI/2;

    pinzalDe = new THREE.Mesh(geopalma, material[8]);
    pinzalDe.position.x += 20;
    pinzalDe.position.y += -10;//Con respecto a mano
    pinzalDe.rotation.x = Math.PI/2;

    //El grafo de escena es así:
    robot.add(base);
    base.add(brazo);
    brazo.add(eje);
    brazo.add(esparrago);
    brazo.add(rotula);
    antebrazo.add(disco);
    for (let i = 0; i < 4; i++) {
        antebrazo.add(nervios[i]);
    }
    mano.add(pinzalIz);
    mano.add(pinzalDe);
    mano.add( new THREE.AxisHelper(1000) );
    antebrazo.add(mano);
    brazo.add(antebrazo);

    // Construir la escena
    scene.add(suelo);
    scene.add(robot);
    scene.add( new THREE.AxisHelper(1000) ); // Ayudante de ejes para la escena

}

function update() {
    // Cambios entre frames

}

function render() {
    // Dibujar cada frame y lo muestra
    requestAnimationFrame(render);// Llega el evento de dibujo en llamada recursiva
    update();//Actualiza la escena
    renderer.render( scene, camera ); // Le decimos al motor que renderice
}

function generateMaterials() {
    // Materiales
    material[0] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(193, 51, 255)"),
        wireframe:true
    });
    material[1] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 64, 0)"),
        wireframe:true
    });
    material[2] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 191, 0)"),
        wireframe:true
    });
    material[3] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(64, 255, 0)"),
        wireframe:true
    });
    material[4] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(0, 128, 255)"),
        wireframe:true
    });
    material[5] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 0, 191)"),
        wireframe:true
    });
    material[6] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(0, 255, 255)"),
        wireframe:true
    });
    material[7] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(255, 0, 64)"),
        wireframe:true
    });
    material[8] = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(0, 255, 64)"),
        wireframe:true
    });
}