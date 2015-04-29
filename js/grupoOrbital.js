//by @demiurgosoft and @softwarejimenez
/*========================= THE sphere ========================= */
//definimos el modelo:
//con las variables de identificadores de buffer de vertices y caras
//definimos las coordenasda de los vertices y de textura
function GrupoOrbital (GL,resx,resy,radiusPlaneta,radiusSatelite,texturaPlaneta,texturaSatelite){
    this.planeta=new astro(GL,resx,resy,radiusPlaneta,texturaPlaneta);
    this.satelite=new astro(GL,resx,resy,radiusSatelite,texturaSatelite);

    this.rotacionSatelite=function(incremento){
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
        LIBS.set_position(this.satelite.matrix, pos_x, 0, pos_z); //ponemos la luna a la izq
        return incremento;
    };
    this.rotacionPlaneta=function(dt){
        //modificmoas matriz de modelado de la tierra
        LIBS.rotateY(this.planeta.matrix, dt * 0.001);
    };
    this.rotacion=function(incremento,dt){
        incremento=this.rotacionSatelite(incremento);
        this.rotacionPlaneta(dt);
        return incremento;
    };
    this.draw=function(){
        this.planeta.draw();
        this.satelite.draw();
    };
};
