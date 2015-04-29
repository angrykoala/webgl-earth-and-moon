//by @demiurgosoft and @softwarejimenez
/*========================= GrupoOrbital ========================= */
function GrupoOrbital (GL,resx,resy,radiusPlaneta,texturaPlaneta){
    this.planeta=new Astro(GL,resx,resy,radiusPlaneta,texturaPlaneta);
    //conjunto de satelites, cada uno tiene una distancia y un incremento para posicionarlo.
    this.satelites = [];
    this.distancias=[];
    this.incremento= [];

    //funcion para añadir un satelite
    this.addSatelite=function(GL,resx,resy,radiusSatelite,texturaSatelite,distancia){
        var satelite=new Astro(GL,resx,resy,radiusSatelite,texturaSatelite);
        this.satelites.push(satelite);
        this.distancias.push(distancia);
        this.incremento.push(0);
    };

    //rotacion de un satelite.
    this.rotacionSatelite=function(index){
        //modificmoas matriz de modelado de un satelite si no se ha hecho click
        if (!raton.click) {
            if (this.incremento[index] <= 2 * Math.PI) {
                this.incremento[index] += 0.005;
            } else {
                this.incremento[index] = 0;
            }
        }
        //posicionamos el satelite
        var pos_x = (-this.distancias[index]) * Math.cos(this.incremento[index]);
        var pos_z = this.distancias[index] * Math.sin(this.incremento[index]);
        LIBS.set_position(this.satelites[index].matrix, pos_x, 0, pos_z); //ponemos el satelite a la izq
    };
    //rotacion de un planta sobre si mismo
    this.rotacionPlaneta=function(dt){
        //modificmoas matriz de modelado del planeta
        LIBS.rotateY(this.planeta.matrix, dt * 0.001);
    };
    //animoamos el sistema solar
    this.animar=function(dt){
        for	(index = 0; index < this.satelites.length; index++) {
            this.rotacionSatelite(index);
        }
        this.rotacionPlaneta(dt);
    };
    //dibujamos el sistma solar
    this.draw=function(){
        this.planeta.draw();
        for	(index = 0; index < this.satelites.length; index++) {
            this.satelites[index].draw();
        }
    };
};
