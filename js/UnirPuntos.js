//Shader vertices
const VSHADER_SOURCE = `
    attribute vec4 position;
    attribute vec4 color;
    
    varying lowp vec4 vColor;
    
    void main() {
       gl_Position = position;
       gl_PointSize = 10.0;
       vColor = color;
    }`;

//Shader fragmentos
const FSHADER_SOURCE = `
    varying lowp vec4 vColor;
    void main() {
       gl_FragColor = vColor;
    }`;

function main() {
    // Recuperar el lienzo
    let canvas = document.getElementById('canvas');
    if (!canvas) {
        console.log("Fallo en la carga del canvas!");
        return;
    }

    // Recuperar el contexto del render
    let gl = getWebGLContext(canvas);
    if(!gl) {
        console.log("Fallo la carga del contexto de render!");
        return;
    }

    // Cargar, compilar y montar los shaders en un programa
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Fallo la carga de los shaders!");
    }

    //Fija el color de borrado del canvas
    gl.clearColor(0.0, 0.0, 0.3, 1.0);

    //Se borra el canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Localiza el atributo en el shader de vertices
    let coordenadas = gl.getAttribLocation(gl.program, 'position');

    // Registrar event
    canvas.onmousedown = function(event){
        click(event, gl, canvas, coordenadas);
    }
}

var puntos = []; // Almacena los puntos
function click(event, gl, canvas, coordenadas) {
    // Procesar la coordenada del click
    let x = event.clientX;
    let y = event.clientY;
    let rect = event.target.getBoundingClientRect();

    // Conversión de coordenadas
    console.log("X: " + "((" + (x-rect.left) + ") - " + (canvas.width/2) + ") * " + (2/canvas.width));
    x = ((x-rect.left) - canvas.width/2) * 2/canvas.width;
    console.log("Y: " + "(" + (canvas.height/2) + " - (" + (y-rect.top) + ")) * " + (2/canvas.height));
    y = (canvas.height/2 - (y-rect.top)) * 2/canvas.height;

    // Guaradar el punto
    let punto = [];
    punto.push(x);
    punto.push(y);
    puntos.push(punto);

    //Se borra el canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Inserta coordenadas y dibuja uno a uno
    for (let i = 0; i < puntos.length; i++) {
        gl.vertexAttrib3f(coordenadas, puntos[i][0], puntos[i][1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}