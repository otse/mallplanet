/// the strange projection for mall planet

import { THREE } from "../mall.js";
import renderer from "../renderer.js";
import hooks from "../util/hooks.js";
import terrain from "./terrain.js";

namespace projection {

	export var camera

	function resize() {
		let width = window.innerWidth;
		let height = window.innerHeight;
		camera.left = width / - 2;
		camera.right = width / 2;
		camera.top = height / 2;
		camera.bottom = height / - 2;
	}

	export function setup() {
		camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.01, 1000);
		camera.position.y = -100;
		camera.zoom = 20;
		renderer.camera = camera;
		resize();

		hooks.register('rendererResize', resize);
		renderer.renderer.setClearColor('cyan');

		renderer.game_objects.rotation.set(Math.PI / 6, Math.PI / 4, 0);
		renderer.game_objects.updateMatrix();
	}

	export function loop() {

	}

	export function quit() {

	}

}

export default projection;