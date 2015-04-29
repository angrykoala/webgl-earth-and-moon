//by @demiurgosoft and @softwarejimenez
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
    _normal:null,
    gestionShaders: function(GL) {
        var shader_vertex_source = "\n\
        attribute vec3 normal;\n\
      attribute vec3 position;\n\
      uniform mat4 Pmatrix;\n\
      uniform mat4 Vmatrix;\n\
      uniform mat4 Mmatrix;\n\
      attribute vec2 uv;\n\
      varying vec2 vUV;\n\
      varying vec3 vNormal;\n\
      varying vec3 vView;\n\
      void main(void) { //pre-built function\n\
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
      vNormal=vec3(Mmatrix*vec4(normal, 0.));\n\
      vView=vec3(Vmatrix*Mmatrix*vec4(position, 1.));\n\
      vUV=uv;\n\
      }";

        var shader_fragment_source = "\n\
        precision mediump float;\n\
        uniform sampler2D sampler;\n\
        varying vec2 vUV;\n\
        varying vec3 vNormal;\n\
        varying vec3 vView;\n\
        const vec3 source_ambient_color=vec3(1.,1.,1.);\n\
        const vec3 source_diffuse_color=vec3(1.,1.,1.);\n\
        const vec3 source_specular_color=vec3(1.,1.,1.);\n\
        const vec3 source_direction=vec3(0.,0.,1.);\n\
        \n\
        const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);\n\
        const vec3 mat_diffuse_color=vec3(1.,1.,1.);\n\
        const vec3 mat_specular_color=vec3(1.,1.,1.);\n\
        const float mat_shininess=10.;\n\
        \n\
        \n\
        \n\
        void main(void) {\n\
            vec3 color=vec3(texture2D(sampler, vUV));\n\
            vec3 I_ambient=source_ambient_color*mat_ambient_color;\n\
            vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));\n\
            vec3 V=normalize(vView);\n\
            vec3 R=reflect(source_direction, vNormal);\n\
            \n\
            \n\
            vec3 I_specular=source_specular_color*mat_specular_color*pow(max(dot(R,V),0.), mat_shininess);\n\
            vec3 I=I_ambient+I_diffuse+I_specular;\n\
            gl_FragColor = vec4(I*color, 1.);\n\
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
        shaders._normal = GL.getAttribLocation(SHADER_PROGRAM, "normal");


        GL.enableVertexAttribArray(shaders._uv);
        GL.enableVertexAttribArray(shaders._position);
        GL.enableVertexAttribArray(shaders._normal);

        GL.useProgram(SHADER_PROGRAM);
        GL.uniform1i(_sampler, 0);
    }
};
