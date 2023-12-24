/// the strange projection for mall planet aka camera setup
// this file will eventually be purged probably
import { THREE } from "../mall.js";
import renderer from "../renderer.js";
import hooks from "../util/hooks.js";
var projection;
(function (projection) {
    var sun;
    projection.type = 'orthographic isometric';
    function reinterpret() {
        switch (projection.type) {
            case 'orthographic top down':
            case 'orthographic isometric':
                renderer.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 1000);
                break;
            case 'perspective top down':
            case 'perspective isometric':
                renderer.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
                break;
        }
        resize();
        renderer.camera.position.setFromSphericalCoords(10, Math.PI / 3, Math.PI / 4);
        renderer.camera.updateMatrix();
        renderer.camera.lookAt(new THREE.Vector3(0, 0, 0));
        renderer.camera.updateMatrix();
        renderer.camera.updateProjectionMatrix();
        //renderer.camera.position.set(5, 10, 5);
        console.log('rotation after lookat', renderer.camera.rotation);
        hooks.call('new_projection');
    }
    projection.reinterpret = reinterpret;
    function start() {
        hooks.register('resize', resize);
        reinterpret();
        renderer.renderer.setClearColor('darkgrey');
        // add the sun
        sun = new THREE.DirectionalLight('white', 0.5);
        sun.position.set(-10, 10, -10);
        sun.target.position.set(0, 0, 0);
        renderer.scene.add(sun);
        renderer.scene.add(sun.target);
    }
    projection.start = start;
    function resize() {
        switch (projection.type) {
            case 'orthographic top down':
            case 'orthographic isometric':
                let width = window.innerWidth;
                let height = window.innerHeight;
                renderer.camera.left = width / -2;
                renderer.camera.right = width / 2;
                renderer.camera.top = height / 2;
                renderer.camera.bottom = height / -2;
                renderer.camera.updateProjectionMatrix();
                break;
            case 'perspective top down':
            case 'perspective isometric':
                renderer.camera.aspect = window.innerWidth / window.innerHeight;
                renderer.camera.updateProjectionMatrix();
                break;
        }
    }
    function loop() {
    }
    projection.loop = loop;
    function quit() {
    }
    projection.quit = quit;
})(projection || (projection = {}));
export default projection;
