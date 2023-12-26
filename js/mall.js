import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
export { THREE as THREE, BufferGeometryUtils }; // just perfect (:)
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
    mall.fps = 0;
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
    let frames = 0;
    let prevTime = 0;
    function animate(time) {
        glob.delta = (time - (last || time)) / 1000;
        last = time;
        // Now fps
        frames++;
        let now = (performance || Date).now();
        if (time >= prevTime + 1000) {
            mall.fps = (frames * 1000) / (now - prevTime);
            prevTime = now;
            frames = 0;
        }
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
