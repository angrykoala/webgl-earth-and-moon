/*========================= SHADERS ========================= */
//clase para gestion de los shader.
//declaramos la matriz de proyeccion,visualizacion y de modelado
//declaramos coordenadas de textrua y de posicion
//creamos, linkamos y compilamos los shader.
var shaders = {
    _Pmatrix: null,
    _Vmatrix: null,
    _Mmatrix: null,
    _uv: null,
    _position: null,
    gestionShaders: function(GL) {
        var shader_vertex_source = "\n\
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

        var shader_fragment_source = "\n\
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
                alert("ERROR IN " + typeString + " SHADER : " + GL.getShaderInfoLog(shader));
                return false;
            }
            return shader;
        }

        var shader_vertex = get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
        var shader_fragment = get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

        var SHADER_PROGRAM = GL.createProgram();
        GL.attachShader(SHADER_PROGRAM, shader_vertex);
        GL.attachShader(SHADER_PROGRAM, shader_fragment);

        GL.linkProgram(SHADER_PROGRAM);

        shaders._Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
        shaders._Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
        shaders._Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

        var _sampler = GL.getUniformLocation(SHADER_PROGRAM, "sampler");
        shaders._uv = GL.getAttribLocation(SHADER_PROGRAM, "uv");
        shaders._position = GL.getAttribLocation(SHADER_PROGRAM, "position");

        GL.enableVertexAttribArray(shaders._uv);
        GL.enableVertexAttribArray(shaders._position);

        GL.useProgram(SHADER_PROGRAM);
        GL.uniform1i(_sampler, 0);
    }
};
