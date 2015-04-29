
/*========================= THE sphere ========================= */
//definimos el modelo:
//con las variables de identificadores de buffer de vertices y caras
//definimos las coordenasda de los vertices y de textura
function planeta (GL,resx,resy,radius,nombre_textura){
    this.esfera=new modelo();
    this.matrix=LIBS.get_I4();
    this.textura= texture.get_texture(nombre_textura, GL);
    this.esfera.defModelo(GL,resx,resy,radius);
    this.rotacion=function(dt){
        //modificmoas matriz de modelado de la tierra
        LIBS.rotateY(this.matrix, dt * 0.001);
    };
    this.draw=function(){
        this.esfera.draw(this.textura,this.matrix);
    };
};
