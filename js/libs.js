//by @demiurgosoft and @softwarejimenez
/*========================= GESTION RATON========================= */
//definimos un objeto de modificacion del modelo de evnetos de raton que recoja drag,dX,dY,AMORTIZATION,THETA,PHI.
//con una funcion para gestionarlos
var raton = {
    drag: false,
    dX: 0,
    dY: 0,
    AMORTIZATION: 0.95,
    THETA: 0,
    PHI: 0,
    gestionarEventos: function(CANVAS) {
        raton.drag = false;
        var old_x, old_y;
        raton.dX = 0;
        raton.dY = 0;

        var mouseDown = function(e) {
            raton.drag = true;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
            return false;
        };

        var mouseUp = function(e) {
            raton.drag = false;
        };

        var mouseMove = function(e) {
            if (!raton.drag) return false;
            raton.dX = (e.pageX - old_x) * Math.PI / CANVAS.width, raton.dY = (e.pageY - old_y) * Math.PI / CANVAS.height;
            raton.THETA += raton.dX;
            raton.PHI += raton.dY;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
        };

        CANVAS.addEventListener("mousedown", mouseDown, false);
        CANVAS.addEventListener("mouseup", mouseUp, false);
        CANVAS.addEventListener("mouseout", mouseUp, false);
        CANVAS.addEventListener("mousemove", mouseMove, false);
    }
};

//recoge un conjunto de funciones basicas.
var LIBS = {

    //crea el contexto de openGL
    getContext: function(CANVAS) {
        try {
            return GL = CANVAS.getContext("experimental-webgl", {
                antialias: true
            });
        } catch (e) {
            alert("You are not webgl compatible :(");
            return false;
        }
    },
    //situa el canvas en la ventana
    editCanvas: function(CANVAS, id) {
        CANVAS = document.getElementById(id);
        CANVAS.width = window.innerWidth;
        CANVAS.height = window.innerHeight;
        return CANVAS;
    },
    //convierte de grado deg a grados Rad.
    degToRad: function(angle) {
        return (angle * Math.PI / 180);
    },

    //devuevle matriz de proyeccion con un angulo con una distancia un left y un right
    get_projection: function(angle, a, zMin, zMax) {
        var tan = Math.tan(LIBS.degToRad(0.5 * angle)),
            A = -(zMax + zMin) / (zMax - zMin),
            B = (-2 * zMax * zMin) / (zMax - zMin);

        return [
            0.5 / tan, 0, 0, 0,
            0, 0.5 * a / tan, 0, 0,
            0, 0, A, -1,
            0, 0, B, 0
        ];
    },

    //devuvelve matriz identidad
    get_I4: function() {
        return [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    //modifica a la matriz identidad
    set_I4: function(m) {
        m[0] = 1, m[1] = 0, m[2] = 0, m[3] = 0,
            m[4] = 0, m[5] = 1, m[6] = 0, m[7] = 0,
            m[8] = 0, m[9] = 0, m[10] = 1, m[11] = 0,
            m[12] = 0, m[13] = 0, m[14] = 0, m[15] = 1;
    },

    //a partir de una matriz calcula la matriz de rotacion con un angulo en x
    rotateX: function(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv1 = m[1],
            mv5 = m[5],
            mv9 = m[9];
        m[1] = m[1] * c - m[2] * s;
        m[5] = m[5] * c - m[6] * s;
        m[9] = m[9] * c - m[10] * s;

        m[2] = m[2] * c + mv1 * s;
        m[6] = m[6] * c + mv5 * s;
        m[10] = m[10] * c + mv9 * s;
    },
    //a partir de una matriz calcula la matriz de rotacion con un angulo en y
    rotateY: function(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0],
            mv4 = m[4],
            mv8 = m[8];
        m[0] = c * m[0] + s * m[2];
        m[4] = c * m[4] + s * m[6];
        m[8] = c * m[8] + s * m[10];

        m[2] = c * m[2] - s * mv0;
        m[6] = c * m[6] - s * mv4;
        m[10] = c * m[10] - s * mv8;
    },
    //a partir de una matriz calcula la matriz de rotacion con un angulo en z
    rotateZ: function(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0],
            mv4 = m[4],
            mv8 = m[8];
        m[0] = c * m[0] - s * m[1];
        m[4] = c * m[4] - s * m[5];
        m[8] = c * m[8] - s * m[9];

        m[1] = c * m[1] + s * mv0;
        m[5] = c * m[5] + s * mv4;
        m[9] = c * m[9] + s * mv8;
    },

    //a partir de una matriz calcula la matriz de traslacion en el eje z.
    translateZ: function(m, t) {
        m[14] += t;
    }
};


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




/*========================= THE CUBE ========================= */
//definimos el modelo:
//con las variables de identificadores de buffer de vertices y caras
//definimos las coordenasda de los vertices y de textura
//creamos los identificadores de los buffer
var modelo={
CUBE_VERTEX:null,
CUBE_FACES:null,
defModelo:function (GL) {
    //POINTS :
    var cube_vertex = [
        -1, -1, -1,
        0, 0,
        1, -1, -1,
        1, 0,
        1, 1, -1,
        1, 1,
        -1, 1, -1,
        0, 1,

        -1, -1, 1,
        0, 0,
        1, -1, 1,
        1, 0,
        1, 1, 1,
        1, 1,
        -1, 1, 1,
        0, 1,

        -1, -1, -1,
        0, 0,
        -1, 1, -1,
        1, 0,
        -1, 1, 1,
        1, 1,
        -1, -1, 1,
        0, 1,

        1, -1, -1,
        0, 0,
        1, 1, -1,
        1, 0,
        1, 1, 1,
        1, 1,
        1, -1, 1,
        0, 1,

        -1, -1, -1,
        0, 0,
        -1, -1, 1,
        1, 0,
        1, -1, 1,
        1, 1,
        1, -1,
        -1, 0, 1,
        -1, 1,
        -1, 0, 0,
        -1, 1, 1,
        1, 0,
        1, 1, 1,
        1, 1,
        1, 1, -1,
        0, 1
    ];

    modelo.CUBE_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, modelo.CUBE_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cube_vertex), GL.STATIC_DRAW);

    //FACES :
    var cube_faces = [
        0, 1, 2,
        0, 2, 3,

        4, 5, 6,
        4, 6, 7,

        8, 9, 10,
        8, 10, 11,

        12, 13, 14,
        12, 14, 15,

        16, 17, 18,
        16, 18, 19,

        20, 21, 22,
        20, 22, 23

    ];
    modelo.CUBE_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, modelo.CUBE_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube_faces), GL.STATIC_DRAW);
}

};



/*========================= TEXTURES ========================= */
//creamos la textura a paritr de una imagen.
var texture={
    get_texture:function (image_URL,GL) {


        var image = new Image();

        image.src = image_URL;
        image.webglTexture = false;


        image.onload = function(e) {

            var texture = GL.createTexture();

            GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);


            GL.bindTexture(GL.TEXTURE_2D, texture);

            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);

            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_LINEAR);

            GL.generateMipmap(GL.TEXTURE_2D);

            GL.bindTexture(GL.TEXTURE_2D, null);

            image.webglTexture = texture;
        };
        return image;
    }
};
