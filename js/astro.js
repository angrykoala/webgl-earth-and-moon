
/*========================= THE sphere ========================= */
//definimos el modelo:
//con las variables de identificadores de buffer de vertices y caras
//definimos las coordenasda de los vertices y de textura
function astro (GL,resx,resy,radius,nombre_textura){
    this.incremento=0;
    this.esfera=new modelo();
    this.matrix=LIBS.get_I4();
    this.textura= texture.get_texture(nombre_textura, GL);
    this.esfera.defModelo(GL,resx,resy,radius);
    
    this.draw=function(){
        this.esfera.draw(this.textura,this.matrix);
    };
};
