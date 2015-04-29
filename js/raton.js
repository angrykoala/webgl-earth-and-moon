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
    click: false,
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
            if (raton.click) raton.click = false;
            else raton.click = true;
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
        CANVAS.addEventListener("mousemove", mouseMove, false);
    }
};
