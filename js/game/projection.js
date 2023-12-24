/// the strange projection for mall planet aka camera setup
// 
import { THREE } from "../mall.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";
import hooks from "../util/hooks.js";
var projection;
(function (projection) {
    let type;
    (function (type) {
        type[type["orthographic_top_down"] = 0] = "orthographic_top_down";
        type[type["orthographic_dimetric"] = 1] = "orthographic_dimetric";
        type[type["orthographic_isometric"] = 2] = "orthographic_isometric";
        type[type["perspective_top_down"] = 3] = "perspective_top_down";
        type[type["perspective_isometric"] = 4] = "perspective_isometric";
        type[type["length"] = 5] = "length";
    })(type = projection.type || (projection.type = {}));
    function string() {
        return `${type[projection.current]} (${projection.current + 1})`;
    }
    projection.string = string;
    projection.current = type.orthographic_dimetric;
    var sun;
    function change() {
        const orthographic = () => {
            renderer.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 1000);
        };
        const perspective = () => {
            renderer.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
        };
        switch (projection.current) {
            case type.orthographic_top_down:
                orthographic();
                projection.yaw.rotation.y = 0;
                projection.pitch.rotation.x = 0;
                projection.zoom = 10;
                break;
            case type.orthographic_dimetric:
                orthographic();
                projection.yaw.rotation.y = Math.PI / 4;
                projection.pitch.rotation.x = Math.PI / 3;
                projection.zoom = 10;
                break;
            case type.orthographic_isometric:
                orthographic();
                projection.yaw.rotation.y = Math.PI / 4;
                projection.pitch.rotation.x = Math.PI / 4;
                projection.zoom = 10;
                break;
            case type.perspective_top_down:
                perspective();
                projection.zoom = 1;
                break;
            case type.perspective_isometric:
                perspective();
                projection.yaw.rotation.y = Math.PI / 4;
                projection.pitch.rotation.x = Math.PI / 3;
                projection.zoom = 1;
                break;
        }
        resize();
        while (projection.pitch.children.length)
            projection.pitch.remove(projection.pitch.children[0]);
        projection.pitch.updateMatrix();
        projection.pitch.add(renderer.camera);
        renderer.camera.position.set(0, 40, 0);
        renderer.camera.rotation.x = -Math.PI / 2;
        renderer.camera.updateMatrix();
        renderer.camera.updateProjectionMatrix();
    }
    projection.change = change;
    function start() {
        hooks.register('resize', resize);
        renderer.renderer.setClearColor('darkgrey');
        // make the yaw, pitch
        projection.zoom = 10;
        projection.yaw = new THREE.Group();
        projection.yaw.rotation.y = Math.PI / 4;
        projection.pitch = new THREE.Group();
        projection.pitch.rotation.x = Math.PI / 3;
        projection.yaw.add(projection.pitch);
        projection.yaw.updateMatrix();
        projection.pitch.updateMatrix();
        renderer.scene.add(projection.yaw);
        // now swap
        change();
        projection.pitch.add(renderer.camera);
        // add the sun
        sun = new THREE.DirectionalLight('white', 0.5);
        sun.position.set(-10, 10, -10);
        sun.target.position.set(0, 0, 0);
        renderer.scene.add(sun);
        renderer.scene.add(sun.target);
    }
    projection.start = start;
    function think() {
        if (mkb.key('f2') == 1) {
            projection.current = projection.current < type.length - 1 ? projection.current + 1 : 0;
            change();
        }
    }
    projection.think = think;
    function resize() {
        switch (projection.current) {
            case type.orthographic_top_down:
            case type.orthographic_dimetric:
            case type.orthographic_isometric:
                let width = window.innerWidth;
                let height = window.innerHeight;
                renderer.camera.left = width / -2;
                renderer.camera.right = width / 2;
                renderer.camera.top = height / 2;
                renderer.camera.bottom = height / -2;
                renderer.camera.updateProjectionMatrix();
                break;
            case type.perspective_top_down:
            case type.perspective_isometric:
                renderer.camera.aspect = window.innerWidth / window.innerHeight;
                renderer.camera.updateProjectionMatrix();
                break;
        }
    }
    function quit() {
    }
    projection.quit = quit;
})(projection || (projection = {}));
export default projection;
