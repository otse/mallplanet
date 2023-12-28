import { THREE } from "../mall.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";
import hooks from "../util/hooks.js";
// We only need 1 projection tho
var projection;
(function (projection) {
    let enum_;
    (function (enum_) {
        enum_[enum_["orthographic_top_down"] = 0] = "orthographic_top_down";
        enum_[enum_["perspective_top_down"] = 1] = "perspective_top_down";
        enum_[enum_["orthographic_dimetric"] = 2] = "orthographic_dimetric";
        enum_[enum_["orthographic_isometric"] = 3] = "orthographic_isometric";
        enum_[enum_["perspective_isometric"] = 4] = "perspective_isometric";
        enum_[enum_["length"] = 5] = "length";
    })(enum_ = projection.enum_ || (projection.enum_ = {}));
    function debug() {
        return `#${projection.value + 1} ${enum_[projection.value]}`;
    }
    projection.debug = debug;
    projection.hit = [0, 0];
    projection.value = enum_.orthographic_top_down;
    var sun;
    function change_projection() {
        const orthographic = () => {
            renderer.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 1, 1000);
        };
        const perspective = () => {
            renderer.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
        };
        switch (projection.value) {
            case enum_.orthographic_top_down:
                orthographic();
                projection.yaw.rotation.y = 0;
                projection.pitch.rotation.x = 0;
                projection.zoom = 2;
                break;
            case enum_.orthographic_dimetric:
                orthographic();
                projection.yaw.rotation.y = Math.PI / 4;
                projection.pitch.rotation.x = Math.PI / 3;
                projection.zoom = 10;
                projection.yup = 400;
                break;
            case enum_.orthographic_isometric:
                orthographic();
                projection.yaw.rotation.y = Math.PI / 4;
                projection.pitch.rotation.x = Math.PI / 4;
                projection.zoom = 2;
                break;
            case enum_.perspective_top_down:
                perspective();
                projection.yaw.rotation.y = 0;
                projection.pitch.rotation.x = 0;
                projection.zoom = 1;
                projection.yup = 200;
                break;
            case enum_.perspective_isometric:
                perspective();
                projection.yaw.rotation.y = Math.PI / 4;
                projection.pitch.rotation.x = Math.PI / 3;
                projection.zoom = 1;
                projection.yup = 200;
                break;
        }
        resize();
        while (projection.pitch.children.length)
            projection.pitch.remove(projection.pitch.children[0]);
        projection.pitch.updateMatrix();
        projection.pitch.add(renderer.camera);
        renderer.camera.position.set(0, projection.yup, 0);
        renderer.camera.rotation.x = -Math.PI / 2;
        renderer.camera.updateMatrix();
        renderer.camera.updateProjectionMatrix();
    }
    projection.change_projection = change_projection;
    function update_mousemarker() {
        let mouse = [projection.pointer.x, projection.pointer.y];
        /*let worldPoint = new THREE.Vector3();
        worldPoint.x = pointer.x;
        worldPoint.y = pointer.y;
        worldPoint.z = 0;
        worldPoint.unproject(renderer.camera);*/
        projection.mousemarker.position.set(projection.point.x, 0, projection.point.z);
        projection.mousemarker.updateMatrix();
        //return [worldPoint.x, worldPoint.y];
    }
    projection.update_mousemarker = update_mousemarker;
    function reset_pointer() {
        let mouse = mkb.mouse_pos();
        //mouse = pts.add(mouse, game.manager.view.rpos);
        projection.pointer.x = (mouse[0] / window.innerWidth) * 2 - 1;
        projection.pointer.y = -(mouse[1] / window.innerHeight) * 2 + 1;
        //console.log(pointer);
        renderer.camera.updateMatrixWorld();
        projection.raycaster.setFromCamera(projection.pointer, renderer.camera);
        projection.raycaster.params.Points.threshold = 1;
        const intersections = projection.raycaster.intersectObjects([flatgrass], true);
        projection.intersection = (intersections.length) > 0 ? intersections[0] : null;
        if (projection.intersection) {
            projection.point = projection.intersection.point;
            projection.hit = [projection.point.x, projection.point.z];
        }
    }
    projection.reset_pointer = reset_pointer;
    let flatgrass;
    function start() {
        hooks.register('resize', resize);
        renderer.renderer.setClearColor('darkgrey');
        renderer.ambient.color.copy(new THREE.Color('white'));
        // Set pointer for use in projection
        let geometry = new THREE.PlaneGeometry(100000, 100000);
        geometry.rotateX(-Math.PI / 2);
        flatgrass = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 'blue' }));
        flatgrass.visible = true;
        projection.point = new THREE.Vector2();
        projection.pointer = new THREE.Vector2();
        projection.raycaster = new THREE.Raycaster();
        // Make yaw, pitch
        projection.yup = 200;
        projection.zoom = 10;
        projection.yaw = new THREE.Group();
        projection.yaw.rotation.y = Math.PI / 4;
        projection.pitch = new THREE.Group();
        projection.pitch.rotation.x = Math.PI / 3;
        projection.yaw.add(projection.pitch);
        projection.yaw.add(new THREE.AxesHelper(2));
        projection.yaw.updateMatrix();
        projection.pitch.updateMatrix();
        projection.pitch.add(renderer.camera);
        projection.mousemarker = new THREE.AxesHelper(5);
        renderer.scene.add(projection.mousemarker);
        renderer.scene.add(projection.yaw);
        change_projection(); // Set the settings
        // Add the sun
        sun = new THREE.DirectionalLight('white', 1);
        sun.position.set(5, 10, 7.5);
        sun.updateMatrix();
        sun.target.position.set(0, 0, 0);
        sun.target.updateMatrix();
        //renderer.scene.add(sun);
        //renderer.scene.add(sun.target);
    }
    projection.start = start;
    function unproject_mouse(mouse) {
        switch (projection.value) {
            case enum_.orthographic_dimetric:
            case enum_.orthographic_isometric:
            case enum_.orthographic_top_down:
                return mouse;
            default:
        }
        let worldPoint = new THREE.Vector3();
        worldPoint.x = mouse[0];
        worldPoint.y = 0;
        worldPoint.z = mouse[1];
        worldPoint.unproject(renderer.camera);
        return [worldPoint.x, worldPoint.z];
    }
    projection.unproject_mouse = unproject_mouse;
    function think() {
        reset_pointer();
        update_mousemarker();
        if (mkb.key_state('f2') == 1) {
            projection.value = projection.value < enum_.length - 1 ? projection.value + 1 : 0;
            change_projection();
        }
    }
    projection.think = think;
    function resize() {
        switch (projection.value) {
            case enum_.orthographic_top_down:
            case enum_.orthographic_dimetric:
            case enum_.orthographic_isometric:
                let width = window.innerWidth;
                let height = window.innerHeight;
                renderer.camera.left = width / -2;
                renderer.camera.right = width / 2;
                renderer.camera.top = height / 2;
                renderer.camera.bottom = height / -2;
                renderer.camera.updateProjectionMatrix();
                break;
            case enum_.perspective_top_down:
            case enum_.perspective_isometric:
                renderer.camera.aspect = window.innerWidth / window.innerHeight;
                renderer.camera.updateProjectionMatrix();
                break;
        }
    }
})(projection || (projection = {}));
export default projection;
