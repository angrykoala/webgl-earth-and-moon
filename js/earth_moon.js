//by @demiurgosoft and @softwarejimenez
function main() {
    function draw(texture1, texture2) {
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height); //definimos el viewport
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.uniformMatrix4fv(shaders._Pmatrix, false, PROJMATRIX); //le pasamos al shader matriz de proyeccion
        GL.uniformMatrix4fv(shaders._Vmatrix, false, VIEWMATRIX); //le pasamos al shader matriz de vista
        GL.uniformMatrix4fv(shaders._Mmatrix, false, MOVEMATRIX); //le pasamos al shader matriz de modelado
        if (texture1.webglTexture) { //le pasamos la textura
            GL.activeTexture(GL.TEXTURE0);
            GL.bindTexture(GL.TEXTURE_2D, texture1.webglTexture);
        }
        GL.bindBuffer(GL.ARRAY_BUFFER, modelo.CUBE_VERTEX); //tomamos el identificador del buffer de vertices
        GL.vertexAttribPointer(shaders._position, 3, GL.FLOAT, false, 4*(3+3+2), 0); //le pasamos al shader las coordenadas de lso vertices
        GL.vertexAttribPointer(shaders._normal, 3, GL.FLOAT, false,4*(3+3+2),3*4) ;//le pasamos al shader las normales
        GL.vertexAttribPointer(shaders._uv, 2, GL.FLOAT, false, 4*(3+3+2), (3+3)*4); //le pasmaos al shader las coordenadas de textrua

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, modelo.CUBE_FACES); //tomamos el identificador del buffer de las caras
        GL.drawElements(GL.TRIANGLES, 10 * 10 * 3 * 2, GL.UNSIGNED_SHORT, 0); //dibujamos.

        //pintamos segunda esfera con distinta matrix de modelo y textura
        if (texture2.webglTexture) { //le pasamos la textura
            GL.activeTexture(GL.TEXTURE0);
            GL.bindTexture(GL.TEXTURE_2D, texture2.webglTexture);
        }
        GL.uniformMatrix4fv(shaders._Mmatrix, false, MOVEMATRIX2); //le pasamos al shader matriz de modelado

        GL.drawElements(GL.TRIANGLES, 10 * 10 * 3 * 2, GL.UNSIGNED_SHORT, 0); //dibujamos.
    }


    //variables necesarias
    var CANVAS, GL;
    CANVAS = LIBS.editCanvas(CANVAS, "your_canvas");
    GL = LIBS.getContext(CANVAS);
    /*========================= MATRIX ========================= */
    //Definimos matriz de proyeccion, modelo y vista
    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var MOVEMATRIX = LIBS.get_I4();
    var MOVEMATRIX2 = LIBS.get_I4();
    var VIEWMATRIX = LIBS.get_I4();
    LIBS.translateZ(VIEWMATRIX, -25); //traslademos el mundo al (0,0,-6)


    raton.gestionarEventos(CANVAS);
    shaders.gestionShaders(GL);
    modelo.defModelo(GL);
    var texture1 = texture.get_texture("img/earth.jpg", GL);
    var texture2 = texture.get_texture("img/moon.gif", GL);
    /*========================= DRAWING ========================= */
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
    GL.clearDepth(1.0);

    var time_old = 0;
    var incremento = 0;

    function animate(time) {
        var dt = time - time_old;
        if (!raton.drag) { //gestionamos el movimiento del raton
            raton.dX *= raton.AMORTIZATION, raton.dY *= raton.AMORTIZATION;
            raton.THETA += raton.dX, raton.PHI += raton.dY;
        }
        //modificmoas matriz de vista a razon de raton
        LIBS.set_I4(VIEWMATRIX);
        LIBS.translateZ(VIEWMATRIX, -20); //traslademos el mundo al (0,0,-6)
        LIBS.rotateY(VIEWMATRIX, raton.THETA);
        LIBS.rotateX(VIEWMATRIX, raton.PHI);

        //modificmoas matriz de modelado de la tierra
        LIBS.rotateY(MOVEMATRIX, dt * 0.001);

        //modificmoas matriz de modelado de la luna si no se ha hecho click
        if (!raton.click) {
            if (incremento <= 2 * Math.PI) {
                incremento += 0.005;
            } else {
                incremento = 0;
            }
        }
        var pos_x = (-6) * Math.cos(incremento);
        var pos_z = 6 * Math.sin(incremento);
        LIBS.set_position(MOVEMATRIX2, pos_x, 0, pos_z); //ponemos la luna a la izq.

        time_old = time;
        draw(texture1, texture2);
        GL.flush();
        window.requestAnimationFrame(animate);
        //si queremos que no se anume window.requestAnimationFrame(animate(0));
    }
    animate(0);
}
