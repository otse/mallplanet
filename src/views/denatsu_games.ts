// as you guessed this is the intro 

import glob from "../util/glob.js";
import hooks from "../util/hooks.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";

import { THREE } from "../mall.js";
import time from "../util/timer.js";
import easings from "../util/easings.js";

namespace denatsu_games {
	export var next

	const seconds = 4
	var plane, ambient, lamp

	let timer, shadetimer

	export function start() {

		console.log(' denatsu games start ');

		renderer.renderer.setClearColor('black');

		let geometry = new THREE.PlaneGeometry(2, 1);
		let material = new THREE.MeshPhongMaterial({
			map: renderer.load_image('./img/denatsu_games.png'),
			color: 'white',
			specular: 'cyan',
			shininess: 150,
			transparent: true
		});
		plane = new THREE.Mesh(geometry, material);

		ambient = new THREE.AmbientLight(0xc1c1c1);

		renderer.scene.add(ambient);
		renderer.scene.add(plane);
		//renderer.scene.add(lamp);

		hooks.register('mallAnimate', animate);

		timer = time(5);
		timer.begin -= 2000;
		shadetimer = time(3);
	}

	export function cleanup() {
		renderer.renderer.setClearColor('grey');
		next?.start();
	}

	export function animate() {
		let shade = easings.easeInCubic(shadetimer.factorc());
		plane.material.color.copy(new THREE.Color(shade, shade, shade));

		let zoom = easings.easeInOutExpo(timer.factorc()) * 3;
		plane.scale.set(zoom, zoom, zoom);

		if (mkb.key('escape') == 1 || timer.done()) {
			console.log(' denatsu escape ');
			
			hooks.unregister('mallAnimate', animate);
			cleanup();
		}
	}
}

export default denatsu_games;