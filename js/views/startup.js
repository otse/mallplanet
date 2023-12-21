// as you guessed this is the intro 
import glob from "../lib/glob.js";
import hooks from "../lib/hooks.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";
import { THREE } from "../mall.js";
import time from "../lib/timer.js";
import easings from "../lib/easings.js";
var startup;
(function (startup) {
    const seconds = 4;
    var plane, ambient, lamp;
    function boot() {
        renderer.renderer.setClearColor('black');
        let geometry = new THREE.PlaneGeometry(2, 1);
        let material = new THREE.MeshPhongMaterial({
            map: renderer.load_image('./img/boomb.png'),
            color: 'white',
            specular: 'blue',
            shininess: 50,
            transparent: true
        });
        plane = new THREE.Mesh(geometry, material);
        ambient = new THREE.AmbientLight(0xc1c1c1);
        lamp = new THREE.PointLight('blue', 10, 10);
        lamp.position.set(0, 0, 2);
        //lamp.add(new THREE.AxesHelper(2));
        renderer.scene.add(ambient);
        renderer.scene.add(plane);
        renderer.scene.add(lamp);
        hooks.register('mallAnimate', animate);
    }
    startup.boot = boot;
    function cleanup() {
        renderer.renderer.setClearColor('grey');
        renderer.scene.remove(plane);
        renderer.scene.remove(ambient);
        renderer.scene.remove(lamp);
    }
    startup.cleanup = cleanup;
    let timer = time(5);
    let zoom = 0;
    let rotation = 0;
    function animate() {
        console.log('startup animate');
        const turns_per_second = 0.6;
        rotation += glob.delta * turns_per_second;
        plane.rotation.x = Math.sin(rotation) / 2;
        plane.rotation.y = Math.sin(rotation);
        //plane.rotation.z = Math.cos(rotation) / 50;
        zoom = easings.easeInOutCubic(timer.factor()) * 2;
        plane.scale.set(zoom, zoom, zoom);
        if (mkb.key('escape') || timer.done()) {
            hooks.unregister('mallAnimate', animate); // todo we're removing a hook while iterating
            cleanup();
        }
    }
    startup.animate = animate;
})(startup || (startup = {}));
export default startup;
