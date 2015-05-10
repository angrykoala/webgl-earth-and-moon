//by @demiurgosoft and @softwarejimenez
//recoge un conjunto de funciones basicas.
var LIBS = {
    getContext: function(CANVAS) {
          var GL;
          try {
            GL = CANVAS.getContext("experimental-webgl", {antialias: true});
            return GL;
          } catch (e) {
            alert("You are not webgl compatible ") ;
            return false;
          }

    },
    //situa el canvas en la ventana
    editCanvas: function(CANVAS,id) {
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
        var mv1 = m[1],mv5 = m[5],mv9 = m[9];
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
        var mv0 = m[0],mv4 = m[4],mv8 = m[8];
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
        var mv0 = m[0],mv4 = m[4],mv8 = m[8];
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
    },
    set_position: function(m, x, y, z) {
        m[12] = x, m[13] = y, m[14] = z;
    },
    translateX: function(m, t) {
        m[12] += t;
    },
    multiplicar: function( m1,m2 ){
	  var m_res = LIBS.get_I4();
	  for( var i = 0;i<4;i++ ){
	     for( var j = 0; j<4;j++ ){
			 m_res[ i*4 + j ] = 0;
			for( var k = 0; k<4;k++ ){
				m_res[ i*4 + j ] += ( m1[ i*4 + k ] * m2[ k*4 + j ]);
			}
		 }
	  }
	  return m_res;
    }
};
