import * as THREE from 'three';
export { THREE as THREE }; // just perfect (:)
import glob from "./util/glob.js";
import renderer from "./renderer.js";
import startup from './views/startup.js';
import { hooks } from './util/hooks.js';
import mkb from './mkb.js';
import main_menu from './views/main_menu.js';
import snd from './snd.js';
import load_screen from './views/load_screen.js';
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
        load_screen.boot(this);
        startup.boot();
        snd.boot();
        startup.next = main_menu;
        requestAnimationFrame(animate);
    }
    mall.boot = boot;
    let last;
    function animate(time) {
        glob.delta = (time - (last || time)) / 1000;
        last = time;
        requestAnimationFrame(animate);
        hooks.call('mallAnimate', 0);
        renderer.render();
    }
})(mall || (mall = {}));
glob.mall = mall;
window.mall = mall;
export default mall;
