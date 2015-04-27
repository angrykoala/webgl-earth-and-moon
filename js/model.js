
/*========================= THE CUBE ========================= */
//definimos el modelo:
//con las variables de identificadores de buffer de vertices y caras
//definimos las coordenasda de los vertices y de textura
//creamos los identificadores de los buffer
var modelo = {
    CUBE_VERTEX: null,
    CUBE_FACES: null,
    defModelo: function(GL) {

        var latitudeBands = 10;
        var longitudeBands = 10;
        var radius = 2;

        var cube_vertex = [];
        for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1 - (longNumber / longitudeBands);
                var v = 1 - (latNumber / latitudeBands);

                //coordenadas vertices
                cube_vertex.push(radius * x);
                cube_vertex.push(radius * y);
                cube_vertex.push(radius * z);

                //coordenas textura
                cube_vertex.push(u);
                cube_vertex.push(v);

            }
        }
        /*
        for(var i=0;i<cube_vertex.length;i+=5){
            console.log(cube_vertex[i]+" "+" "+cube_vertex[i+1]+" "+" "+cube_vertex[i+2]);
            console.log(cube_vertex[i+3]+" "+" "+cube_vertex[i+4]);
        }*/
        modelo.CUBE_VERTEX = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, modelo.CUBE_VERTEX);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cube_vertex), GL.STATIC_DRAW);

        //FACES :
        var cube_faces = [];
        for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
                var first = (latNumber * (longitudeBands + 1)) + longNumber;
                var second = first + longitudeBands + 1;
                cube_faces.push(first);
                cube_faces.push(second);
                cube_faces.push(first + 1);

                cube_faces.push(second);
                cube_faces.push(second + 1);
                cube_faces.push(first + 1);
            }
        }
        modelo.CUBE_FACES = GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, modelo.CUBE_FACES);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube_faces), GL.STATIC_DRAW);
    }
};
