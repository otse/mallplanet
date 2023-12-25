import { THREE } from "../mall.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";
import hooks from "../util/hooks.js";
// We only need 1 projection tho
var projection;
(function (projection) {
    let projection_enum;
    (function (projection_enum) {
        projection_enum[projection_enum["orthographic_top_down"] = 0] = "orthographic_top_down";
        projection_enum[projection_enum["perspective_top_down"] = 1] = "perspective_top_down";
        projection_enum[projection_enum["orthographic_dimetric"] = 2] = "orthographic_dimetric";
        projection_enum[projection_enum["orthographic_isometric"] = 3] = "orthographic_isometric";
        projection_enum[projection_enum["perspective_isometric"] = 4] = "perspective_isometric";
        projection_enum[projection_enum["length"] = 5] = "length";
    })(projection_enum = projection.projection_enum || (projection.projection_enum = {}));
    function debug() {
        return `${projection_enum[projection.current]} (${projection.current + 1})`;
    }
    projection.debug = debug;
    projection.current = projection_enum.orthographic_top_down;
    var sun;
    function change() {
        const orthographic = () => {
            renderer.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 1000);
        };
        const perspective = () => {
            renderer.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
        };
        switch (projection.current) {
            case projection_enum.orthographic_top_down:
                orthographic();
                projection.yaw.rotation.y = 0;
                projection.pitch.rotation.x = 0;
                projection.zoom = 2;
                break;
            case projection_enum.orthographic_dimetric:
                orthographic();
                projection.yaw.rotation.y = Math.PI / 4;
                projection.pitch.rotation.x = Math.PI / 3;
                projection.zoom = 2;
                break;
            case projection_enum.orthographic_isometric:
                orthographic();
                projection.yaw.rotation.y = Math.PI / 4;
                projection.pitch.rotation.x = Math.PI / 4;
                projection.zoom = 2;
                break;
            case projection_enum.perspective_top_down:
                perspective();
                projection.yaw.rotation.y = 0;
                projection.pitch.rotation.x = 0;
                projection.zoom = 1;
                break;
            case projection_enum.perspective_isometric:
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
        renderer.ambient.color.copy(new THREE.Color('white'));
        // Make yaw, pitch
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
        sun = new THREE.DirectionalLight('white', 1);
        sun.position.set(5, 10, 7.5);
        sun.updateMatrix();
        sun.target.position.set(0, 0, 0);
        sun.target.updateMatrix();
        //renderer.scene.add(sun);
        //renderer.scene.add(sun.target);
    }
    projection.start = start;
    function think() {
        if (mkb.key_state('f2') == 1) {
            projection.current = projection.current < projection_enum.length - 1 ? projection.current + 1 : 0;
            change();
        }
    }
    projection.think = think;
    function resize() {
        switch (projection.current) {
            case projection_enum.orthographic_top_down:
            case projection_enum.orthographic_dimetric:
            case projection_enum.orthographic_isometric:
                let width = window.innerWidth;
                let height = window.innerHeight;
                renderer.camera.left = width / -2;
                renderer.camera.right = width / 2;
                renderer.camera.top = height / 2;
                renderer.camera.bottom = height / -2;
                renderer.camera.updateProjectionMatrix();
                break;
            case projection_enum.perspective_top_down:
            case projection_enum.perspective_isometric:
                renderer.camera.aspect = window.innerWidth / window.innerHeight;
                renderer.camera.updateProjectionMatrix();
                break;
        }
    }
})(projection || (projection = {}));
export default projection;
