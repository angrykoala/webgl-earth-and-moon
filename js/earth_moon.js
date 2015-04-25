//by @demiurgosoft and @softwarejimenez


function main() {

    //definimos un objeto de modificacion del modelo que recoja drag,dX,dY,AMORTIZATION,THETA,PHI.
    var raton = {
        drag:false,
        dX:0,
        dY:0,
        AMORTIZATION:0.95,
        THETA:0,
        PHI:0
    };


    /*========================= SHADERS ========================= */
    function gestionShaders(){
        var shader_vertex_source="\n\
      attribute vec3 position;\n\
      uniform mat4 Pmatrix;\n\
      uniform mat4 Vmatrix;\n\
      uniform mat4 Mmatrix;\n\
      attribute vec2 uv;\n\
      varying vec2 vUV;\n\
      void main(void) { //pre-built function\n\
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
      vUV=uv;\n\
      }";

        var shader_fragment_source="\n\
      precision mediump float;\n\
      uniform sampler2D sampler;\n\
      varying vec2 vUV;\n\
      \n\
      \n\
      void main(void) {\n\
      gl_FragColor = texture2D(sampler, vUV);\n\
      }";

      function get_shader(source, type, typeString) {
          var shader = GL.createShader(type);
          GL.shaderSource(shader, source);
          GL.compileShader(shader);
          if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
            return false;
          }
          return shader;
        }

        var shader_vertex=get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
        var shader_fragment=get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

        var SHADER_PROGRAM=GL.createProgram();
        GL.attachShader(SHADER_PROGRAM, shader_vertex);
        GL.attachShader(SHADER_PROGRAM, shader_fragment);

        GL.linkProgram(SHADER_PROGRAM);

        _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
        _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
        _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

        _sampler = GL.getUniformLocation(SHADER_PROGRAM, "sampler");
        _uv = GL.getAttribLocation(SHADER_PROGRAM, "uv");
        _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

        GL.enableVertexAttribArray(_uv);
        GL.enableVertexAttribArray(_position);

        GL.useProgram(SHADER_PROGRAM);
        GL.uniform1i(_sampler, 0);

      }
      /*========================= THE CUBE ========================= */

      function defModelo(){
      //POINTS :
      var cube_vertex=[
        -1,-1,-1,    0,0,
        1,-1,-1,     1,0,
        1, 1,-1,     1,1,
        -1, 1,-1,    0,1,

        -1,-1, 1,    0,0,
        1,-1, 1,     1,0,
        1, 1, 1,     1,1,
        -1, 1, 1,    0,1,

        -1,-1,-1,    0,0,
        -1, 1,-1,    1,0,
        -1, 1, 1,    1,1,
        -1,-1, 1,    0,1,

        1,-1,-1,     0,0,
        1, 1,-1,     1,0,
        1, 1, 1,     1,1,
        1,-1, 1,     0,1,

        -1,-1,-1,    0,0,
        -1,-1, 1,    1,0,
        1,-1, 1,     1,1,
        1,-1,-1,     0,1,

        -1, 1,-1,    0,0,
        -1, 1, 1,    1,0,
        1, 1, 1,     1,1,
        1, 1,-1,     0,1
      ];

      CUBE_VERTEX= GL.createBuffer ();
      GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
      GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(cube_vertex),GL.STATIC_DRAW);

      //FACES :
      var cube_faces = [
        0,1,2,
        0,2,3,

        4,5,6,
        4,6,7,

        8,9,10,
        8,10,11,

        12,13,14,
        12,14,15,

        16,17,18,
        16,18,19,

        20,21,22,
        20,22,23

      ];
      CUBE_FACES= GL.createBuffer ();
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
      GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,new Uint16Array(cube_faces),GL.STATIC_DRAW);
    }

    /*========================= TEXTURES ========================= */
   function get_texture(image_URL){


      var image=new Image();

      image.src=image_URL;
      image.webglTexture=false;


      image.onload=function(e) {

        var texture=GL.createTexture();

        GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);


        GL.bindTexture(GL.TEXTURE_2D, texture);

        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);

        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_LINEAR);

        GL.generateMipmap(GL.TEXTURE_2D);

        GL.bindTexture(GL.TEXTURE_2D, null);

        image.webglTexture=texture;
      };

      return image;
    }

    function draw(){
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
        GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
        GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
        if (cube_texture.webglTexture) {

          GL.activeTexture(GL.TEXTURE0);

          GL.bindTexture(GL.TEXTURE_2D, cube_texture.webglTexture);
        }
        GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false,4*(3+2),0) ;
        GL.vertexAttribPointer(_uv, 2, GL.FLOAT, false,4*(3+2),3*4) ;

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
        GL.drawElements(GL.TRIANGLES, 6*2*3, GL.UNSIGNED_SHORT, 0);
    }


/*========================= FIN FUNCIONES ========================= */




    //variables necesarias
    var CANVAS,GL,_Pmatrix,_Vmatrix,_Mmatrix,_sampler,_uv,_position;
    CANVAS=LIBS.editCanvas(CANVAS,"your_canvas");
  /*========================= MATRIX ========================= */

  var PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
  var MOVEMATRIX=LIBS.get_I4();
  var VIEWMATRIX=LIBS.get_I4();

  LIBS.translateZ(VIEWMATRIX, -6);


  LIBS.gestionarEventos(raton,CANVAS);

  GL=LIBS.getContext(CANVAS);

  gestionShaders();
  var CUBE_VERTEX,CUBE_FACES;
  defModelo();
  var cube_texture=get_texture("img/texture.png");


  /*========================= DRAWING ========================= */
  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  GL.clearDepth(1.0);

  var time_old=0;
  function animate(time) {
    var dt=time-time_old;
    if (!raton.drag) {
      raton.dX*=raton.AMORTIZATION, raton.dY*=raton.AMORTIZATION;
      raton.THETA+=raton.dX, raton.PHI+=raton.dY;
    }
    LIBS.set_I4(MOVEMATRIX);
    LIBS.rotateY(MOVEMATRIX, raton.THETA);
    LIBS.rotateX(MOVEMATRIX, raton.PHI);
    time_old=time;
    draw();
    GL.flush();
    window.requestAnimationFrame(animate);
    //si queremos que no se anume window.requestAnimationFrame(animate(0));
  }
  animate(0);


}
