//by @demiurgosoft and @softwarejimenez
function main() {

    function draw() {
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);//definimos el viewport
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.uniformMatrix4fv(shaders._Pmatrix, false, PROJMATRIX);//le pasamos al shader matriz de proyeccion
        GL.uniformMatrix4fv(shaders._Vmatrix, false, VIEWMATRIX);//le pasamos al shader matriz de vista
        GL.uniformMatrix4fv(shaders._Mmatrix, false, MOVEMATRIX);//le pasamos al shader matriz de modelado
        if (cube_texture.webglTexture) {//le pasamos la textura
            GL.activeTexture(GL.TEXTURE0);
            GL.bindTexture(GL.TEXTURE_2D, cube_texture.webglTexture);
        }
        GL.bindBuffer(GL.ARRAY_BUFFER, modelo.CUBE_VERTEX);//tomamos el identificador del buffer de vertices
        GL.vertexAttribPointer(shaders._position, 3, GL.FLOAT, false, 4 * (3 + 2), 0);//le pasamos al shader las coordenadas de lso vertices
        GL.vertexAttribPointer(shaders._uv, 2, GL.FLOAT, false, 4 * (3 + 2), 3 * 4);//le pasmaos al shader las coordenadas de textrua

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, modelo.CUBE_FACES);//tomamos el identificador del buffer de las caras
        GL.drawElements(GL.TRIANGLES, 6 * 2 * 3, GL.UNSIGNED_SHORT, 0);//dibujamos.
    }


    //variables necesarias
    var CANVAS, GL;
    CANVAS = LIBS.editCanvas(CANVAS, "your_canvas");
    GL = LIBS.getContext(CANVAS);
    /*========================= MATRIX ========================= */
    //Definimos matriz de proyeccion, modelo y vista
    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var MOVEMATRIX = LIBS.get_I4();
    var VIEWMATRIX = LIBS.get_I4();
    LIBS.translateZ(VIEWMATRIX, -6);//traslademos el mundo al (0,0,-6)
    raton.gestionarEventos(CANVAS);
    shaders.gestionShaders(GL);
    modelo.defModelo(GL);
    var cube_texture = texture.get_texture("img/texture.png",GL);
    /*========================= DRAWING ========================= */
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
    GL.clearDepth(1.0);

    var time_old = 0;
    function animate(time) {
        var dt = time - time_old;
        if (!raton.drag) {//gestionamos el movimiento del raton
            raton.dX *= raton.AMORTIZATION, raton.dY *= raton.AMORTIZATION;
            raton.THETA += raton.dX, raton.PHI += raton.dY;
        }
        //modificmoas matriz de modelado
        LIBS.set_I4(MOVEMATRIX);
        LIBS.rotateY(MOVEMATRIX, raton.THETA);
        LIBS.rotateX(MOVEMATRIX, raton.PHI);
        time_old = time;
        draw();
        GL.flush();
        window.requestAnimationFrame(animate);
        //si queremos que no se anume window.requestAnimationFrame(animate(0));
    }
    animate(0);
}
