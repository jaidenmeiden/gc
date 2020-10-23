/**
 *    Seminario GPC #5. Iluminación y Texturas
 *    Usos de fuentes e luz, calculo de sombras, materiales, texturas de superposicón,
 *  texura de entorno y video como textura
 *
 */

// Variables imprescindibles
let renderer, scene, camera;

let cameraControl;

// Variables globales
let esferacubo, cubo, angulo = 0;
let video, videoImage, videoImageContext, videotexture;

// Acciones
init();
loadScene();
render();

function init() {
    // Crear el motor, la escena y la camara

    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF));
    renderer.shadowMap.enabled = true;
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camara
    let ar = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(50, ar, 0.1, 100);
    scene.add(camera);
    camera.position.set(0.5, 3, 9);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControl.target.set(0, 0, 0);

    // Luces
    let luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.2);
    scene.add(luzAmbiente);

    let luzPuntual = new THREE.PointLight(0xFFFFFF, 0.5);
    luzPuntual.position.set(-10, 10, -10);
    scene.add(luzPuntual);

    let luzDireccional = new THREE.DirectionalLight(0xFFFFFF, 0.5);
    luzDireccional.position.set(-10, 5, 10);
    scene.add(luzDireccional);

    let luzFocal = new THREE.SpotLight(0xFFFFFF, 0.5);
    luzFocal.position.set(10, 10, 1);
    luzFocal.target.position.set(0, 0, 0);
    luzFocal.angle = Math.PI / 10;
    luzFocal.penumbra = 0.2;
    luzFocal.castShadow = true;
    scene.add(luzFocal);
}

function loadScene() {
    // Cargar la escena con objetos

    // Texturas
    let path = "images/";
    let texturaSuelo = new THREE.TextureLoader().load(path + 'wet_ground_512x512.jpg');
    texturaSuelo.magFilter = THREE.LinearFilter;
    texturaSuelo.minFilter = THREE.LinearFilter;
    texturaSuelo.repeat.set(3, 2);
    texturaSuelo.wrapS = texturaSuelo.wrapT = THREE.MirroredRepeatWrapping;

    let texturaCubo = new THREE.TextureLoader().load(path + 'wood512.jpg');

    let texturaEsfera = new THREE.TextureLoader().load(path + 'Earth.jpg');

    let paredes = [path + 'pond/posx.jpg', path + 'pond/negx.jpg',
        path + 'pond/posy.jpg', path + 'pond/negy.jpg',
        path + 'pond/posz.jpg', path + 'pond/negz.jpg'
    ];
    let mapaEntorno = new THREE.CubeTextureLoader().load(paredes);

    // Materiales
    let materialBasico = new THREE.MeshBasicMaterial({color: 'yellow'});
    let materialMate = new THREE.MeshLambertMaterial({color: 'red', map: texturaCubo});
    let matsuelo = new THREE.MeshLambertMaterial({color: 'white', map: texturaSuelo});
    let materialBrillante = new THREE.MeshPhongMaterial({
        color: 'white',
        specular: 'white',
        shininess: 50,
        envMap: mapaEntorno
    });

    // Geometrias
    let geocubo = new THREE.BoxGeometry(2, 2, 2);
    let geoesfera = new THREE.SphereGeometry(1, 30, 30);
    let geosuelo = new THREE.PlaneGeometry(20, 20, 200, 200);

    // Objetos
    cubo = new THREE.Mesh(geocubo, materialMate);
    cubo.position.x = -1;
    cubo.receiveShadow = true;
    cubo.castShadow = true;

    let esfera = new THREE.Mesh(geoesfera, materialBrillante);
    esfera.position.x = 1;
    esfera.receiveShadow = true;
    esfera.castShadow = true;

    esferacubo = new THREE.Object3D();
    esferacubo.position.y = 1;

    let suelo = new THREE.Mesh(geosuelo, matsuelo);
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.y = -0.5;
    suelo.receiveShadow = true;


    // Modelo importado
    let loader = new THREE.ObjectLoader();
    loader.load('models/soldado/soldado.json',
        function (obj) {
            let objtx = new THREE.TextureLoader().load('models/soldado/soldado.png');
            obj.material.map = objtx;
            obj.position.y = 1;
            obj.receiveShadow = true;
            obj.castShadow = true;
            cubo.add(obj);
        });

    // Habitacion
    let shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = mapaEntorno;

    let matparedes = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        dephtWrite: false,
        side: THREE.BackSide
    });

    let habitacion = new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), matparedes);
    scene.add(habitacion);

    // Pantalla y video

    /// Crear el elemento de video en el documento
    video = document.createElement('video');
    video.src = 'videos/Pixar.mp4';
    video.muted = "muted";
    video.load();
    video.play();

    /// Asociar la imagen de video a un canvas 2D
    videoImage = document.createElement('canvas');
    videoImage.width = 632;
    videoImage.height = 256;

    /// Obtengo un contexto para ese canvas
    videoImageContext = videoImage.getContext('2d');
    videoImageContext.fillStyle = '#0000FF';
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

    /// Crear la textura
    videotexture = new THREE.Texture(videoImage);
    videotexture.minFilter = THREE.LinearFilter;
    videotexture.magFilter = THREE.LinearFilter;

    /// Crear el material con la textura
    let moviematerial = new THREE.MeshBasicMaterial({
        map: videotexture,
        side: THREE.DoubleSide
    });

    /// Crear la geometria de la pantalla
    let movieGeometry = new THREE.PlaneGeometry(15, 256 / 632 * 15);
    let movie = new THREE.Mesh(movieGeometry, moviematerial);
    movie.position.set(0, 5, -7);
    scene.add(movie);

    // Construir la escena
    esferacubo.add(cubo);
    esferacubo.add(esfera);
    scene.add(esferacubo);
    scene.add(suelo);
    cubo.add(new THREE.AxisHelper(1));
    scene.add(new THREE.AxisHelper(3));

}

function update() {
	// Cambios entre frames
	angulo += Math.PI/100;
	//esferacubo.rotation.y = angulo;
	//cubo.rotation.x = angulo/2;

	// Actulizar video
	if(video.readyState === video.HAVE_ENOUGH_DATA){
		videoImageContext.drawImage(video,0,0);
		if(videotexture) videotexture.needsUpdate = true;
	}
}

function render() {
    // Dibujar cada frame y lo muestra
    requestAnimationFrame(render);// Llega el evento de dibujo en llamada recursiva
    update();//Actualiza la escena
    renderer.render(scene, camera); // Le decimos al motor que renderice
}