/// the strange projection for mall planet
import { THREE } from "../mall.js";
import renderer from "../renderer.js";
import hooks from "../util/hooks.js";
var projection;
(function (projection) {
    function resize() {
        //return;
        let width = window.innerWidth;
        let height = window.innerHeight;
        renderer.camera.left = width / -2;
        renderer.camera.right = width / 2;
        renderer.camera.top = height / 2;
        renderer.camera.bottom = height / -2;
    }
    function setup() {
        renderer.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.01, 1000);
        resize();
        hooks.register('rendererResize', resize);
        renderer.renderer.setClearColor('cyan');
        //renderer.game_objects.rotation.set(Math.PI / 6, Math.PI / 4, 0);
        renderer.game_objects.updateMatrix();
    }
    projection.setup = setup;
    function loop() {
    }
    projection.loop = loop;
    function quit() {
    }
    projection.quit = quit;
})(projection || (projection = {}));
export default projection;
