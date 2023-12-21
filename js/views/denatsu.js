// as you guessed this is the intro 
import hooks from "../lib/hooks.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";
import time from "../lib/timer.js";
var startup;
(function (startup) {
    const seconds = 4;
    var plane, ambient, lamp;
    function boot() {
        renderer.renderer.setClearColor('black');
        hooks.register('mallAnimate', animate);
    }
    startup.boot = boot;
    function cleanup() {
        renderer.renderer.setClearColor('grey');
    }
    startup.cleanup = cleanup;
    let timer = time(5);
    function animate() {
        if (mkb.key('escape') || timer.done()) {
            hooks.unregister('mallAnimate', animate);
            cleanup();
        }
    }
    startup.animate = animate;
})(startup || (startup = {}));
export default startup;
