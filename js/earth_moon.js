//by @demiurgosoft and @softwarejimenez
function main() {

    //variables necesarias
    var CANVAS, GL;
    CANVAS=LIBS.editCanvas(CANVAS, "your_canvas");
    GL = LIBS.getContext(CANVAS);

    var resx = 20;
    var resy = 20;
    var radius = 2;
    var distancia=6;
    var sistemaSolar= new GrupoOrbital(GL,resx,resy,radius,"img/earth.jpg");
    sistemaSolar.addSatelite(GL,resx,resy,radius-1,"img/moon.gif",distancia);


    var angle=40;
    var distancia=25;
    matrix.inicialize(CANVAS,angle,distancia);


    raton.gestionarEventos(CANVAS);
    shaders.gestionShaders(GL);
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
        sistemaSolar.animar(dt);
        matrix.pasarMatricesShader(GL,CANVAS);

        sistemaSolar.draw();
        GL.flush();
        window.requestAnimationFrame(animate);
        //si queremos que no se anume window.requestAnimationFrame(animate(0));
    }
    animate(0);
}
