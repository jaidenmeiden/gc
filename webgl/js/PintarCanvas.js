function main() {
    let maxColor = 255;

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
    //Fija el color de borrado del canvas
    gl.clearColor(255/maxColor, 87/maxColor, 51/maxColor, 1.0);

    //Se borra el canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
}