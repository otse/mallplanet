import * as THREE from 'three';
export { THREE as THREE }; // just perfect (:)
import glob from "./glob.js";
import renderer from "./renderer.js";
var mall;
(function (mall) {
    const constant = 1;
    function boot() {
        console.log(' mall boot ');
        renderer.boot();
        glob.mall = mall;
        glob.t = THREE;
        dom_ready('');
    }
    mall.boot = boot;
    function dom_ready(word) {
        console.log(' dom_ready mall ');
        renderer.dom_ready(word);
        requestAnimationFrame(renderer.render);
    }
})(mall || (mall = {}));
console.log(' mall outside ');
glob.mall = mall;
mall.boot();
export default mall;
