// as you guessed this is the intro 

import glob from "../lib/glob.js";
import hooks from "../lib/hooks.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";

import mall, { THREE } from "../mall.js";
import time from "../lib/timer.js";
import easings from "../lib/easings.js";

namespace startup {
	const seconds = 4
	var plane, ambient, lamp

	export function boot() {

		renderer.renderer.setClearColor('black');

		let geometry = new THREE.PlaneGeometry(2, 1);
		let material = new THREE.MeshPhongMaterial({
			map: renderer.load_image('./img/boomb.png'),
			color: 'white',
			specular: 'blue',
			shininess: 150,
			transparent: true
		});
		plane = new THREE.Mesh(geometry, material);

		ambient = new THREE.AmbientLight(0xc1c1c1);
		lamp = new THREE.PointLight('blue', 10, 10)
		lamp.position.set(0, 0, 2);
		//lamp.add(new THREE.AxesHelper(2));

		renderer.scene.add(ambient);
		renderer.scene.add(plane);
		renderer.scene.add(lamp);

		hooks.register('mallAnimate', animate);

		timer = time(5);
		timer.begin -= 2000;
	}

	export function cleanup() {
		renderer.renderer.setClearColor('grey');
		renderer.scene.remove(plane);
		renderer.scene.remove(ambient);
		renderer.scene.remove(lamp);
	}

	let timer
	let zoom = 0
	let rotation = 0
	export function animate() {
		let pitch = easings.easeOutQuad(timer.factorc());
		let yaw = easings.easeInOutQuart(timer.factorc());
		plane.rotation.x = -(1 - pitch) * 1.0;
		plane.rotation.y = (1 - yaw) * Math.PI / 2;
		plane.material.needsUpdate = true;
		let zoom = easings.easeInOutBack(timer.factorc()) * 2;
		plane.scale.set(zoom, zoom, zoom);
		if (mkb.key('escape') || timer.done()) {
			hooks.unregister('mallAnimate', animate); // todo we're removing a hook while iterating
			cleanup();
		}
	}
}

export default startup;