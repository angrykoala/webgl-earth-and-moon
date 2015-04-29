//by @demiurgosoft and @softwarejimenez
function main() {

    //variables necesarias
    var CANVAS, GL;
    CANVAS = LIBS.editCanvas(CANVAS, "your_canvas");
    GL = LIBS.getContext(CANVAS);


    var tierra = new modelo();
    var luna = new modelo();


    var angle=40;
    var distancia=25;
    matrix.inicialize(CANVAS,angle,distancia);


    raton.gestionarEventos(CANVAS);
    shaders.gestionShaders(GL);
    var resx = 20;
    var resy = 20;
    var radius = 2;
    tierra.defModelo(GL,resx,resy,radius);
    luna.defModelo(GL,resx,resy,radius-1);
    var texture_earth = texture.get_texture("img/earth.jpg", GL);
    var texture_moon = texture.get_texture("img/moon.gif", GL);
    /*========================= DRAWING ========================= */
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
    GL.clearDepth(1.0);

    var time_old = 0;

    function animate(time) {
        var dt = time - time_old;
        time_old = time;
        matrix.gestionraton();
        matrix.rotacionTierra(dt);
        matrix.rotacionLuna();
        matrix.pasarMatricesShader(GL,CANVAS);

        tierra.draw(texture_earth,matrix.MOVEMATRIX);
        luna.draw(texture_moon,matrix.MOVEMATRIX2);
        GL.flush();
        window.requestAnimationFrame(animate);
        //si queremos que no se anume window.requestAnimationFrame(animate(0));
    }
    animate(0);
}
