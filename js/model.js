//by @demiurgosoft and @softwarejimenez
/*========================= THE sphere ========================= */
//definimos el modelo:
//con las variables de identificadores de buffer de vertices y caras
//definimos las coordenasda de los vertices y de textura
function modelo (){
    this.SPHERE_VERTEX= null,
    this.SPHERE_FACES=null,
    this.numeroIndices=0,
    this.defModelo=function(GL,resx,resy,radius) {

        var vertex = [];
        for (var i = 0; i <= resx; i++) {
            var theta = i * Math.PI / resx;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var j = 0; j <= resy; j++) {
                var phi = j * 2 * Math.PI / resy;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1 - (j / resy);
                var v = 1 - (i / resx);

                //coordenadas vertices
                vertex.push(radius * x);
                vertex.push(radius * y);
                vertex.push(radius * z);

                //normales
                vertex.push(x);
                vertex.push(y);
                vertex.push(z);

                //coordenas textura
                vertex.push(u);
                vertex.push(v);

            }
        }
        this.SPHERE_VERTEX = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.SPHERE_VERTEX);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertex), GL.STATIC_DRAW);

        //FACES :
        var faces = [];
        for (var i = 0; i < resx; i++) {
            for (var j = 0; j < resy; j++) {
                var first = (i * (resy + 1)) + j;
                var second = first + resy + 1;
                faces.push(first);
                faces.push(second);
                faces.push(first + 1);

                faces.push(second);
                faces.push(second + 1);
                faces.push(first + 1);
            }
        }
        this.numeroIndices=faces.length;
        this.SPHERE_FACES = GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.SPHERE_FACES);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), GL.STATIC_DRAW);
    };
    this.draw=function (GL,texture,matrixModelo ) {

        GL.uniformMatrix4fv(shaders._Mmatrix, false, matrixModelo); //le pasamos al shader matriz de modelado
        if (texture.webglTexture) { //le pasamos la textura
            GL.activeTexture(GL.TEXTURE0);
            GL.bindTexture(GL.TEXTURE_2D, texture.webglTexture);
        }
        GL.bindBuffer(GL.ARRAY_BUFFER, this.SPHERE_VERTEX); //tomamos el identificador del buffer de vertices
        GL.vertexAttribPointer(shaders._position, 3, GL.FLOAT, false, 4*(3+3+2), 0); //le pasamos al shader las coordenadas de lso vertices
        GL.vertexAttribPointer(shaders._normal, 3, GL.FLOAT, false,4*(3+3+2),3*4) ;//le pasamos al shader las normales
        GL.vertexAttribPointer(shaders._uv, 2, GL.FLOAT, false, 4*(3+3+2), (3+3)*4); //le pasmaos al shader las coordenadas de textrua

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.SPHERE_FACES); //tomamos el identificador del buffer de las caras
        GL.drawElements(GL.TRIANGLES, this.numeroIndices, GL.UNSIGNED_SHORT, 0); //dibujamos.
    };
};
