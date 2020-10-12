/**
 *	Seminario GPC #2. FormaBasica
 *	Dibujar formas basicas con animacion
 *
 */

// Variables imprescindibles
let renderer, scene, camera;

// Variables globales
let esferacubo, cubo, angulo = 0;

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
    camera = new THREE.PerspectiveCamera( 50, ar, 0.1, 100 ); // Inicializa camara (Angulo, razón de aspecto, Distancia con efecto, Distancia sin efecto)
    scene.add(camera);//Agregamos la camara a la escena
    camera.position.set(0.5,3,9);// Posición e la camara (Diferente a la posición  defecto)
    camera.lookAt(new THREE.Vector3(0,2,0)); // A donde esta mirando la cámara
}

function loadScene() {
    // Cargar la escena con objetos

    // Materiales
    let material = new THREE.MeshBasicMaterial({color:'yellow',wireframe:true}); //DEfinimos el material
    //Le decimos que contruya el objeto amarillo y que solo muestre las aristas

    // Geometrias
    let geocubo = new THREE.BoxGeometry(2,2,2); // Geometría del cubo
    let geoesfera = new THREE.SphereGeometry(1, 30, 30);

    // Objetos
    cubo = new THREE.Mesh( geocubo, material );// Dobujamos un cubo
    cubo.position.x = -1; // Aplicar desplazamiento al cubo
    cubo.rotation.y = Math.PI/4;
    // Tener presente que la trasformación de rotación sucede primero sin importar el orden de los comandos
    // Orden: Scaling, Rotation (Z, Y, X) and Translation y se aplica de derecha a izquierda (TRS)
    // El orden se peude formatear con la instrucción: tela.matrixAutoUpdate = false;

    let esfera = new THREE.Mesh( geoesfera, material );
    esfera.position.x = 1;

    esferacubo = new THREE.Object3D();
    esferacubo.position.y = 1;
    esferacubo.rotation.y = angulo;

    // Modelo importado
    var loader = new THREE.ObjectLoader();
    loader.load( 'models/soldado/soldado.json' ,
        function(obj){
            obj.position.y = 1;
            cubo.add(obj);
        });

    // Construir la escena
    esferacubo.add(cubo);
    esferacubo.add(esfera);
    scene.add(esferacubo);
    cubo.add(new THREE.AxisHelper(1)); // Ayudante de ejes para el cubo
    scene.add( new THREE.AxisHelper(3) ); // Ayudante de ejes para la escena

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