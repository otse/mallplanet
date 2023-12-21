/// mouse keyboard
var mkb;
(function (mkb) {
    let KEY;
    (function (KEY) {
        KEY[KEY["OFF"] = 0] = "OFF";
        KEY[KEY["PRESS"] = 1] = "PRESS";
        KEY[KEY["WAIT"] = 2] = "WAIT";
        KEY[KEY["AGAIN"] = 3] = "AGAIN";
        KEY[KEY["UP"] = 4] = "UP";
    })(KEY = mkb.KEY || (mkb.KEY = {}));
    ;
    let MOUSE;
    (function (MOUSE) {
        MOUSE[MOUSE["UP"] = -1] = "UP";
        MOUSE[MOUSE["OFF"] = 0] = "OFF";
        MOUSE[MOUSE["DOWN"] = 1] = "DOWN";
        MOUSE[MOUSE["STILL"] = 2] = "STILL";
    })(MOUSE = mkb.MOUSE || (mkb.MOUSE = {}));
    ;
    var keys = {};
    var buttons = {};
    var pos = [0, 0];
    mkb.wheel = 0;
    function onmousemove(e) {
        pos[0] = e.clientX;
        pos[1] = e.clientY;
    }
    function onmousedown(e) {
        buttons[e.button] = 1;
        if (e.button == 1)
            return false;
    }
    function onmouseup(e) {
        buttons[e.button] = MOUSE.UP;
    }
    function onwheel(e) {
        mkb.wheel = e.deltaY < 0 ? 1 : -1;
    }
    function onkeys(event) {
        const key = event.key.toLowerCase();
        if ('keydown' == event.type)
            keys[key] = keys[key] ? KEY.AGAIN : KEY.PRESS;
        else if ('keyup' == event.type)
            keys[key] = KEY.UP;
        if (event.keyCode == 114)
            event.preventDefault();
    }
    function attach_listeners() {
        document.onkeydown = document.onkeyup = onkeys;
        document.onmousemove = onmousemove;
        document.onmousedown = onmousedown;
        document.onmouseup = onmouseup;
        document.onwheel = onwheel;
    }
    mkb.attach_listeners = attach_listeners;
    // api functions for consoomers:
    function key(k) {
        return keys[k];
    }
    mkb.key = key;
    function button(b) {
        return buttons[b];
    }
    mkb.button = button;
    function mouse() {
        return [...pos];
    }
    mkb.mouse = mouse;
})(mkb || (mkb = {}));
export default mkb;
