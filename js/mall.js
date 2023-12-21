import * as THREE from 'three';
export { THREE as THREE }; // just perfect (:)
import glob from "./lib/glob.js";
import renderer from "./renderer.js";
var mall;
(function (mall) {
    const constant = 1;
    function boot() {
        console.log(' boot mall ');
        renderer.boot('');
        requestAnimationFrame(renderer.render);
    }
    mall.boot = boot;
})(mall || (mall = {}));
console.log(' mall outside ');
glob.mall = mall;
mall.boot();
export default mall;
