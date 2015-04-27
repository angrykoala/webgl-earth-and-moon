/*========================= TEXTURES ========================= */
//creamos la textura a paritr de una imagen.
var texture = {
    get_texture: function(image_URL, GL) {
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
