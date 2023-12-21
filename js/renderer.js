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
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, 1024 / 768, 1, 1000);
        camera.position.z = 10;
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(1024, 768);
        document.getElementById('webgl').append(renderer.domElement);
        renderer.setClearColor('grey');
        let geometry = new THREE.SphereGeometry(1, 32, 16);
        let material = new THREE.MeshLambertMaterial({ wireframe: true, color: 'white' });
        let sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    }
    renderer_1.dom_ready = dom_ready;
    function render() {
        renderer.render(scene, camera);
    }
    renderer_1.render = render;
})(renderer || (renderer = {}));
export default renderer;
