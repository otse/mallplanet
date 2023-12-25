/// mouse / keyboard
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
    let MOUSE;
    (function (MOUSE) {
        MOUSE[MOUSE["UP"] = -1] = "UP";
        MOUSE[MOUSE["OFF"] = 0] = "OFF";
        MOUSE[MOUSE["DOWN"] = 1] = "DOWN";
        MOUSE[MOUSE["STILL"] = 2] = "STILL";
    })(MOUSE = mkb.MOUSE || (mkb.MOUSE = {}));
    var keys = {};
    var mb = {};
    var pos = [0, 0];
    mkb.wheel = 0;
    function onmousemove(e) {
        pos[0] = e.clientX;
        pos[1] = e.clientY;
    }
    function onmousedown(e) {
        mb[e.button] = 1;
        if (e.button == 1)
            return false;
    }
    function onmouseup(e) {
        mb[e.button] = MOUSE.UP;
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
    function post_keys() {
        for (let i in keys) {
            if (keys[i] == KEY.PRESS)
                keys[i] = KEY.WAIT;
            else if (keys[i] == KEY.UP)
                keys[i] = KEY.OFF;
        }
    }
    function post_mouse_buttons() {
        for (let b of [0, 1, 2])
            if (mb[b] == MOUSE.DOWN)
                mb[b] = MOUSE.STILL;
            else if (mb[b] == MOUSE.UP)
                mb[b] = MOUSE.OFF;
    }
    function loop() {
        mkb.wheel = 0;
        post_keys();
        post_mouse_buttons();
    }
    mkb.loop = loop;
    function attach_listeners() {
        document.onkeydown = document.onkeyup = onkeys;
        document.onmousemove = onmousemove;
        document.onmousedown = onmousedown;
        document.onmouseup = onmouseup;
        document.onwheel = onwheel;
    }
    mkb.attach_listeners = attach_listeners;
    // api functions for consoomers:
    function key_state(k) {
        return keys[k];
    }
    mkb.key_state = key_state;
    function mouse_button(b) {
        return mb[b];
    }
    mkb.mouse_button = mouse_button;
    function mouse_pos() {
        return [...pos];
    }
    mkb.mouse_pos = mouse_pos;
})(mkb || (mkb = {}));
export default mkb;
