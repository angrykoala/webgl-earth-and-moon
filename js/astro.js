
/*========================= ASTRO ========================= */
//un astro se identifica por un modelo esfera, una matriz de modelado y una textura
function Astro (GL,resx,resy,radius,nombre_textura){
    this.esfera=new modelo();
    this.esfera.defModelo(GL,resx,resy,radius);
    this.matrix=LIBS.get_I4();
    this.textura= texture.get_texture(nombre_textura, GL);

    //funcion dibujar
    this.draw=function(){
        this.esfera.draw(GL,this.textura,this.matrix);
    };
};
