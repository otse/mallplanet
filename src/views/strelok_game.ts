// as you guessed this is the intro 

import glob from "../util/glob.js";
import hooks from "../util/hooks.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";

import mall, { THREE } from "../mall.js";
import time, { timer } from "../util/timer.js";
import easings from "../util/easings.js";
import snd from "../snd.js";

namespace strelok_game {
	export var next

	const seconds = 4
	var plane, ambient, lamp
	let music

	export function start() {
		
		mall.view = this;

		renderer.renderer.setClearColor('black');

		console.log(' strelok game start ');
		
		let geometry = new THREE.PlaneGeometry(2, 1);
		let material = new THREE.MeshPhongMaterial({
			map: renderer.load_image('./img/strelok_game.png'),
			color: 'white',
			specular: 'cyan',
			shininess: 150,
			transparent: true
		});
		plane = new THREE.Mesh(geometry, material);

		ambient = new THREE.AmbientLight(0xc1c1c1);
		lamp = new THREE.PointLight('blue', 1, 10)
		lamp.position.set(0, 0, 3);
		//lamp.add(new THREE.AxesHelper(2));

		renderer.scene.add(ambient);
		renderer.scene.add(plane);
		renderer.scene.add(lamp);
		
		//music = snd.play_regular('strelok', 1.0);

		//renderer.lock_aspect = true;
		//renderer.camera.aspect = 1;

		hooks.register('mall_planet_animate', animate);

		timer = time(5);
		shadetimer = time(3);
		timer.begin -= 2000;
	}

	export function cleanup() {
		renderer.renderer.setClearColor('grey');
		renderer.scene.remove(plane);
		renderer.scene.remove(ambient);
		renderer.scene.remove(lamp);
		renderer.resize();
		music?.stop();
		next?.start();
		hooks.unregister('mall_planet_animate', animate);
	}

	let shadetimer 
	let timer: timer
	let zoom = 0
	let rotation = 0
	export function animate() {
		let pitch = 1 - easings.easeOutQuad(timer.factorc());
		let yaw = easings.easeInOutQuart(timer.factorc());
		let shade = easings.easeInCubic(shadetimer.factorc());
		let emissive = (1 - easings.easeInOutBack(timer.factorc())) / 2;
		plane.rotation.x = -pitch * 1.0;
		plane.rotation.y = (1 - yaw) * Math.PI / 4;
		plane.material.color.copy(new THREE.Color(shade, shade, shade));
		//plane.material.emissive.copy(new THREE.Color(emissive, emissive, emissive));
		plane.material.needsUpdate = true;
		let zoom = easings.easeInOutBack(timer.factorc()) * 3;
		plane.scale.set(zoom, zoom, zoom);
		if (mkb.key_state('escape') == 1 || timer.done()) {
			cleanup();
		}
	}
}

export default strelok_game;