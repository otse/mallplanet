import * as THREE from 'three';
export { THREE as THREE }; // just perfect (:)
import hooks from './util/hooks.js';
import glob from "./util/glob.js";
import renderer from "./renderer.js";
import strelok_game_prerendered from './views/strelok_game_prerendered.js';
import denatsu_games from './views/denatsu_games.js';
import mkb from './mkb.js';
import snd from './snd.js';
import loading_screen from './views/loading_screen.js';
import main_menu from './views/main_menu.js';
import manager from './game/manager.js';
var mall;
(function (mall) {
    const constant = 1;
    function sample(a) {
        return a[Math.floor(Math.random() * a.length)];
    }
    mall.sample = sample;
    function clamp(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }
    mall.clamp = clamp;
    function boot() {
        glob.salt = '';
        console.log(' boot mall ');
        mall.whole = document.getElementById('page');
        mkb.attach_listeners();
        renderer.boot('');
        loading_screen.start(this);
        loading_screen.next = denatsu_games;
        denatsu_games.next = strelok_game_prerendered;
        strelok_game_prerendered.next = main_menu;
        snd.boot();
        requestAnimationFrame(animate);
    }
    mall.boot = boot;
    let last;
    function animate(time) {
        glob.delta = (time - (last || time)) / 1000;
        last = time;
        requestAnimationFrame(animate);
        hooks.call('mall_planet_animate', 0);
        manager.think();
        renderer.render();
        mkb.loop();
    }
})(mall || (mall = {}));
glob.mall = mall;
window.mall = mall;
export default mall;
