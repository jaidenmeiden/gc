/**
 * Seminario GPC #4  Animación por simulación física.
 * Esferas en habitación cerrada con molinete central
 *
 * @requires three_r96.js, coordinates.js, orbitControls.js, cannon.js, tween.js, stats_r16.js
 * @author rvivo / http://personales.upv.es/rvivo
 * @date 2020
 */

// Globales convenidas por threejs
let renderer, scene, camera;
// Control de camara
let cameraControls;
// Monitor de recursos
let stats;
// Mundo fisico
let world, reloj;
// Objetos
const nesferas = 20;
let esferas = [];

initPhysicWorld();
initVisualWorld();
loadWorld();
render();

/**
 * Construye una bola con cuerpo y vista
 */
function esfera( radio, posicion, material ){
    let masa = 1;
    this.body = new CANNON.Body( {mass: masa, material: material} );
    this.body.addShape( new CANNON.Sphere( radio ) );
    this.body.position.copy( posicion );
    this.visual = new THREE.Mesh( new THREE.SphereGeometry( radio ),
        new THREE.MeshBasicMaterial( {wireframe: true } ) );
    this.visual.position.copy( this.body.position );
}

/**
 * Inicializa el mundo fisico con un
 * suelo y cuatro paredes de altura infinita
 */
function initPhysicWorld()
{
    // Mundo 
    world = new CANNON.World();
    world.gravity.set(0,-9.8,0);
    ///world.broadphase = new CANNON.NaiveBroadphase(); 
    world.solver.iterations = 10;

    // Material y comportamiento
    let groundMaterial = new CANNON.Material("groundMaterial");
    let materialEsfera = new CANNON.Material("sphereMaterial");
    world.addMaterial( materialEsfera );
    world.addMaterial( groundMaterial );
    // -existe un defaultContactMaterial con valores de restitucion y friccion por defecto
    // -en caso que el material tenga su friccion y restitucion positivas, estas prevalecen 
    let sphereGroundContactMaterial = new CANNON.ContactMaterial(groundMaterial,materialEsfera,
        { friction: 0.3,
            restitution: 0.7 });
    world.addContactMaterial(sphereGroundContactMaterial);

    // Suelo
    let groundShape = new CANNON.Plane();
    let ground = new CANNON.Body({ mass: 0, material: groundMaterial });
    ground.addShape(groundShape);
    ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.addBody(ground);

    // Paredes
    let backWall = new CANNON.Body( {mass:0, material:groundMaterial} );
    backWall.addShape( new CANNON.Plane() );
    backWall.position.z = -5;
    world.addBody( backWall );
    let frontWall = new CANNON.Body( {mass:0, material:groundMaterial} );
    frontWall.addShape( new CANNON.Plane() );
    frontWall.quaternion.setFromEuler(0,Math.PI,0,'XYZ');
    frontWall.position.z = 5;
    world.addBody( frontWall );
    let leftWall = new CANNON.Body( {mass:0, material:groundMaterial} );
    leftWall.addShape( new CANNON.Plane() );
    leftWall.position.x = -5;
    leftWall.quaternion.setFromEuler(0,Math.PI/2,0,'XYZ');
    world.addBody( leftWall );
    let rightWall = new CANNON.Body( {mass:0, material:groundMaterial} );
    rightWall.addShape( new CANNON.Plane() );
    rightWall.position.x = 5;
    rightWall.quaternion.setFromEuler(0,-Math.PI/2,0,'XYZ');
    world.addBody( rightWall );
}

/**
 * Inicializa la escena visual
 */
function initVisualWorld()
{
    // Inicializar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( new THREE.Color(0x000000) );
    document.getElementById( 'container' ).appendChild( renderer.domElement );

    // Crear el grafo de escena
    scene = new THREE.Scene();
    scene.add( new THREE.AxisHelper(3) ); // Ayudante de ejes para la escena

    // Reloj
    reloj = new THREE.Clock();
    reloj.start();

    // Crear y situar la camara
    let aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 75, aspectRatio , 0.1, 100 );
    camera.position.set( 2,5,10 );
    camera.lookAt( new THREE.Vector3( 0,0,0 ) );
    // Control de camara
    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(0,0,0);

    // STATS --> stats.update() en update()
    stats = new Stats();
    stats.showPanel(0);	// FPS inicialmente. Picar para cambiar panel.
    document.getElementById( 'container' ).appendChild( stats.domElement );

    // Callbacks
    window.addEventListener('resize', updateAspectRatio );
}

/**
 * Carga los objetos es el mundo físico y visual
 */
function loadWorld()
{
    // Genera las esferas
    let materialEsfera;
    for( i=0; i<world.materials.length; i++){
        if( world.materials[i].name === "sphereMaterial" ) materialEsfera = world.materials[i];
    }
    for (let i = 0; i < nesferas; i++) {;
        let e = new esfera( 1/2, new CANNON.Vec3( -1, i+1, 0 ), materialEsfera );
        world.addBody( e.body );
        scene.add( e.visual );
        esferas.push( e );
    };
    // Restricciones
    for (let i = 0; i < esferas.length-1; i++) {
        let restriccion = new CANNON.PointToPointConstraint(esferas[i].body,
            new CANNON.Vec3( 0, 1/2, 0),
            esferas[i+1].body,
            new CANNON.Vec3( 0, -1/2, 0) );
        world.addConstraint( restriccion );
    };

    // El molinete: Es un disco fijo (masa=0) con velocidad angular que se representa como
    // un disco girando con tween
    let discShape = new CANNON.Cylinder(2,2,0.1,10); // ojo: eje en z
    let discBody = new CANNON.Body({ mass: 0 });
    discBody.addShape(discShape);
    discBody.quaternion.setFromEuler( -Math.PI/2,0,0 );
    discBody.angularVelocity.set(0,3,0);
    discBody.angularDamping = 0.1;
    world.addBody(discBody);

    let molinete = new THREE.Mesh( new THREE.CylinderGeometry(2,2,0.1),
        new THREE.MeshBasicMaterial( {wireframe:true}) );
    scene.add( molinete );
    molinete.add( new THREE.AxisHelper(1) );
    molinete.position.copy( discBody.position );

    let giro = new TWEEN.Tween( molinete.rotation ).to( {x:0, y:2*Math.PI, z:0}, 1000 );
    giro.repeat(Infinity);
    giro.start();

    // Suelo
    Coordinates.drawGrid({size:10,scale:1, orientation:"x"});

    scene.add( new THREE.AxisHelper(5 ) );
}

/**
 * Isotropía frente a redimension del canvas
 */
function updateAspectRatio()
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
}

/**
 * Actualizacion segun pasa el tiempo
 */
function update()
{
    let segundos = reloj.getDelta();	// tiempo en segundos que ha pasado
    world.step( segundos );				// recalcula el mundo tras ese tiempo

    for (let i = 0; i < esferas.length; i++) {
        esferas[i].visual.position.copy( esferas[i].body.position );
        esferas[i].visual.quaternion.copy( esferas[i].body.quaternion );
    };

    // Actualiza el monitor 
    stats.update();

    // Actualiza el movimeinto del molinete
    TWEEN.update();
}

/**
 * Update & render
 */
function render()
{
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}