import { THREE } from "./mall.js";
var renderer;
(function (renderer_1) {
    const ad_hoc = 0;
    var renderer, scene, camera;
    function boot() {
    }
    renderer_1.boot = boot;
    function dom_ready(word) {
        console.log(' dom_ready renderer ');
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(1024, 768);
        //glob.ipc.send('asynchronous-append', ['webgl', renderer.domElement]);
        document.getElementById('webgl').append(renderer.domElement);
    }
    renderer_1.dom_ready = dom_ready;
})(renderer || (renderer = {}));
export default renderer;
