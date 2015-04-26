//by @demiurgosoft and @softwarejimenez
function main() {

    function draw() {
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.uniformMatrix4fv(shaders._Pmatrix, false, PROJMATRIX);
        GL.uniformMatrix4fv(shaders._Vmatrix, false, VIEWMATRIX);
        GL.uniformMatrix4fv(shaders._Mmatrix, false, MOVEMATRIX);
        if (cube_texture.webglTexture) {

            GL.activeTexture(GL.TEXTURE0);

            GL.bindTexture(GL.TEXTURE_2D, cube_texture.webglTexture);
        }
        GL.bindBuffer(GL.ARRAY_BUFFER, modelo.CUBE_VERTEX);
        GL.vertexAttribPointer(shaders._position, 3, GL.FLOAT, false, 4 * (3 + 2), 0);
        GL.vertexAttribPointer(shaders._uv, 2, GL.FLOAT, false, 4 * (3 + 2), 3 * 4);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, modelo.CUBE_FACES);
        GL.drawElements(GL.TRIANGLES, 6 * 2 * 3, GL.UNSIGNED_SHORT, 0);
    }


    //variables necesarias
    var CANVAS, GL;
    CANVAS = LIBS.editCanvas(CANVAS, "your_canvas");

    /*========================= MATRIX ========================= */
    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var MOVEMATRIX = LIBS.get_I4();
    var VIEWMATRIX = LIBS.get_I4();

    LIBS.translateZ(VIEWMATRIX, -6);

    raton.gestionarEventos(CANVAS);

    GL = LIBS.getContext(CANVAS);

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
        if (!raton.drag) {
            raton.dX *= raton.AMORTIZATION, raton.dY *= raton.AMORTIZATION;
            raton.THETA += raton.dX, raton.PHI += raton.dY;
        }
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
