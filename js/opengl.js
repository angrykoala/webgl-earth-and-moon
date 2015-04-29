//by @demiurgosoft and @softwarejimenez
//atributos especificos de opengl
var Opengl = {
    GL:null,
    CANVAS:null,
    //crea el contexto de openGL
    getContext: function() {
        try {
            Opengl.GL = CANVAS.getContext("experimental-webgl", {antialias: true});
        } catch (e) {
            alert("You are not webgl compatible :(");
            return false;
        }
    },
    //situa el canvas en la ventana
    editCanvas: function(id) {
        Opengl.CANVAS = document.getElementById(id);
        Opengl.CANVAS.width = window.innerWidth;
        Opengl.CANVAS.height = window.innerHeight;
    },
};
