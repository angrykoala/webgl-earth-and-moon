
/*========================= THE sphere ========================= */
//definimos el modelo:
//con las variables de identificadores de buffer de vertices y caras
//definimos las coordenasda de los vertices y de textura
function satelite (GL,resx,resy,radius,nombre_textura){
    this.incremento=0;
    this.esfera=new modelo();
    this.matrix=LIBS.get_I4();
    this.textura= texture.get_texture(nombre_textura, GL);
    this.esfera.defModelo(GL,resx,resy,radius);
    this.rotacion=function(){
        //modificmoas matriz de modelado de la luna si no se ha hecho click
        if (!raton.click) {
            if (this.incremento <= 2 * Math.PI) {
                this.incremento += 0.005;
            } else {
                this.incremento = 0;
            }
        }
        var pos_x = (-6) * Math.cos(this.incremento);
        var pos_z = 6 * Math.sin(this.incremento);
        LIBS.set_position(this.matrix, pos_x, 0, pos_z); //ponemos la luna a la izq
    };
    this.draw=function(){
        this.esfera.draw(this.textura,this.matrix);
    };
};
