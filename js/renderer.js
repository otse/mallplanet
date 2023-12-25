import glob from "./util/glob.js";
import hooks from "./util/hooks.js";
import { THREE } from "./mall.js";
var renderer;
(function (renderer_1) {
    renderer_1.ndpi = 1;
    const ad_hoc = 0;
    function resize() {
        renderer_1.camera.aspect = window.innerWidth / window.innerHeight;
        renderer_1.camera.updateProjectionMatrix();
        hooks.call('resize');
        renderer_1.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    renderer_1.resize = resize;
    function test_sphere() {
        let geometry = new THREE.SphereGeometry(1, 32, 16);
        let material = new THREE.MeshLambertMaterial({ wireframe: true, color: 'white' });
        let sphere = new THREE.Mesh(geometry, material);
        renderer_1.scene.add(sphere);
    }
    function boot(word) {
        console.log(' boot renderer ');
        console.log('THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE', THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE);
        THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = false;
        renderer_1.ambient = new THREE.AmbientLight(0xffffff);
        renderer_1.clock = new THREE.Clock();
        renderer_1.scene = new THREE.Scene();
        renderer_1.scene.add(renderer_1.ambient);
        renderer_1.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
        renderer_1.camera.position.z = 10;
        renderer_1.game_objects = new THREE.Group();
        //game_objects.rotation.set(Math.PI / 6, Math.PI / 4, 0);
        //game_objects.updateMatrix();
        renderer_1.scene.add(renderer_1.game_objects);
        renderer_1.renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer_1.renderer.setSize(1024, 768);
        renderer_1.renderer.setClearColor('grey');
        renderer_1.renderer.shadowMap.enabled = true;
        renderer_1.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        document.getElementById('webgl').append(renderer_1.renderer.domElement);
        window.addEventListener('resize', resize);
        resize();
    }
    renderer_1.boot = boot;
    function load_image(file) {
        let texture = new THREE.TextureLoader().load(file + `?v=${glob.salt}`);
        texture.generateMipmaps = false;
        //texture.center.set(0, 1);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
    renderer_1.load_image = load_image;
    function render() {
        renderer_1.renderer.render(renderer_1.scene, renderer_1.camera);
    }
    renderer_1.render = render;
})(renderer || (renderer = {}));
export default renderer;
