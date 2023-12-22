// as you guessed this is the intro 
import hooks from "../util/hooks.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";
import time from "../util/timer.js";
var denatsu_games;
(function (denatsu_games) {
    const seconds = 4;
    var plane, ambient, lamp;
    function boot() {
        renderer.renderer.setClearColor('black');
        hooks.register('mallAnimate', animate);
    }
    denatsu_games.boot = boot;
    function cleanup() {
        renderer.renderer.setClearColor('grey');
    }
    denatsu_games.cleanup = cleanup;
    let timer = time(5);
    function animate() {
        if (mkb.key('escape') || timer.done()) {
            hooks.unregister('mallAnimate', animate);
            cleanup();
        }
    }
    denatsu_games.animate = animate;
})(denatsu_games || (denatsu_games = {}));
export default denatsu_games;
