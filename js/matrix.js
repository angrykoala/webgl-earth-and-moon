//by @demiurgosoft and @softwarejimenez
/*========================= MATRIX ========================= */
//Definimos matriz de proyeccion, modelo y vista
var matrix = {
    PROJMATRIX:null,
    VIEWMATRIX:null,
    distancia:null,
    inicialize: function(CANVAS,angle,d) {
        matrix.distancia=d;
        matrix.PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
        matrix.VIEWMATRIX = LIBS.get_I4();
        LIBS.translateZ(matrix.VIEWMATRIX, -matrix.distancia); //traslademos el mundo al (0,0,-distancia)
    },
    gestionraton:function(){
        if (!raton.drag) { //gestionamos el movimiento del raton
            raton.dX *= raton.AMORTIZATION, raton.dY *= raton.AMORTIZATION;
            raton.THETA += raton.dX, raton.PHI += raton.dY;
        }
        //modificmoas matriz de vista a razon de raton
       LIBS.set_I4(matrix.VIEWMATRIX);
       LIBS.translateZ(matrix.VIEWMATRIX, -matrix.distancia); //traslademos el mundo al (0,0,-6)
       LIBS.rotateY(matrix.VIEWMATRIX, raton.THETA);
       LIBS.rotateX(matrix.VIEWMATRIX, raton.PHI);
   },

   pasarMatricesShader:function(GL,CANVAS){
       GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height); //definimos el viewport
       GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
       GL.uniformMatrix4fv(shaders._Pmatrix, false, matrix.PROJMATRIX); //le pasamos al shader matriz de proyeccion
       GL.uniformMatrix4fv(shaders._Vmatrix, false, matrix.VIEWMATRIX); //le pasamos al shader matriz de vista
   }
};
