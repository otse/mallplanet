import { THREE } from "./mall.js";
var renderer;
(function (renderer_1) {
    const ad_hoc = 0;
    function resize() {
        renderer_1.camera.aspect = window.innerWidth / window.innerHeight;
        renderer_1.camera.updateProjectionMatrix();
        renderer_1.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function test_sphere() {
        let geometry = new THREE.SphereGeometry(1, 32, 16);
        let material = new THREE.MeshLambertMaterial({ wireframe: true, color: 'white' });
        let sphere = new THREE.Mesh(geometry, material);
        renderer_1.scene.add(sphere);
    }
    function boot(word) {
        console.log(' boot renderer ');
        renderer_1.ambient = new THREE.AmbientLight(0xffffff);
        renderer_1.clock = new THREE.Clock();
        renderer_1.scene = new THREE.Scene();
        renderer_1.scene.add(renderer_1.ambient);
        renderer_1.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
        renderer_1.camera.position.z = 10;
        renderer_1.renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer_1.renderer.setSize(1024, 768);
        renderer_1.renderer.setClearColor('grey');
        document.getElementById('webgl').append(renderer_1.renderer.domElement);
        window.addEventListener('resize', resize);
        resize();
    }
    renderer_1.boot = boot;
    function render() {
        renderer_1.renderer.render(renderer_1.scene, renderer_1.camera);
    }
    renderer_1.render = render;
})(renderer || (renderer = {}));
export default renderer;
