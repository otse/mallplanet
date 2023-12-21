import * as THREE from 'three';
export { THREE as THREE }; // just perfect (:)
import glob from "./lib/glob.js";
import renderer from "./renderer.js";
import startup from './views/startup.js';
import { hooks } from './lib/hooks.js';
import page from './page.js';
var mall;
(function (mall) {
    const constant = 1;
    function boot() {
        glob.salt = '';
        console.log(' boot mall ');
        page.listen();
        renderer.boot('');
        startup.boot();
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
console.log(' mall outside ');
glob.mall = mall;
mall.boot();
export default mall;
