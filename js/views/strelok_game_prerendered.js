/// a 3d logo was very amaturish so i turned this into a gif
import hooks from "../util/hooks.js";
import mkb from "../mkb.js";
import mall from "../mall.js";
import timer from "../util/timer.js";
var strelok_game_prerendered;
(function (strelok_game_prerendered) {
    let timerr;
    function start() {
        mall.view = this;
        mall.whole.style.background = 'black';
        mall.whole.innerHTML = `<img src="./img/strelok_game_prerendered.gif" />`;
        hooks.register('mall_planet_animate', animate);
        timerr = new timer(3);
    }
    strelok_game_prerendered.start = start;
    function cleanup() {
        mall.whole.innerHTML = '';
        strelok_game_prerendered.next?.start();
        hooks.unregister('mall_planet_animate', animate);
    }
    strelok_game_prerendered.cleanup = cleanup;
    function animate() {
        if (mkb.key_state('escape') == 1 || timerr.done()) {
            cleanup();
        }
    }
    strelok_game_prerendered.animate = animate;
})(strelok_game_prerendered || (strelok_game_prerendered = {}));
export default strelok_game_prerendered;
