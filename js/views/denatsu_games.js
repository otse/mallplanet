// as you guessed this is the intro 
import hooks from "../util/hooks.js";
import mkb from "../mkb.js";
import mall from "../mall.js";
import { timer } from "../util/timer.js";
var denatsu_games;
(function (denatsu_games) {
    let timerr;
    function start() {
        mall.view = this;
        mall.whole.style.background = 'black';
        mall.whole.innerHTML = `<img src="./img/denatsu_games.jpg" />`;
        hooks.register('mall_planet_animate', animate);
        timerr = new timer(2);
        mall.view = this;
    }
    denatsu_games.start = start;
    function cleanup() {
        mall.whole.innerHTML = '';
        denatsu_games.next?.start();
        hooks.unregister('mall_planet_animate', animate);
    }
    denatsu_games.cleanup = cleanup;
    function animate() {
        if (mkb.key_state('escape') == 1 || timerr.done()) {
            cleanup();
        }
    }
    denatsu_games.animate = animate;
})(denatsu_games || (denatsu_games = {}));
export default denatsu_games;
