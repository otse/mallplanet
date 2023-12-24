/// the strange projection for mall planet aka camera setup

// 

import { THREE } from "../mall.js";
import renderer from "../renderer.js";
import hooks from "../util/hooks.js";
import game_manager from "./game_manager.js";

namespace projection {

	type projection =
		'orthographic top down'
		| 'orthographic isometric'
		| 'perspective top down'
		| 'perspective isometric'

	var sun

	export var yaw, pitch

	export var type: projection = 'orthographic isometric'

	export function reinterpret() {
		switch (type) {
			case 'orthographic top down':
			case 'orthographic isometric':
				renderer.camera = new THREE.OrthographicCamera(
					0, 0, 0, 0, 1, 1000);
				break;
			case 'perspective top down':
			case 'perspective isometric':
				renderer.camera = new THREE.PerspectiveCamera(
					45, 1, 1, 1000);
				break;
		}
		resize();
		if (type == 'orthographic isometric' || type == 'perspective isometric') {
			//renderer.camera.position.setFromSphericalCoords(30, Math.PI / 3, Math.PI / 4);
			//renderer.camera.updateMatrix();
			renderer.camera.position.set(0, 40, 0);
		}
		else {
			renderer.camera.position.set(0, 40, 0);
		}
		renderer.camera.rotation.x = -Math.PI / 2;
		renderer.camera.updateMatrix();
		//renderer.camera.lookAt(new THREE.Vector3(0, 0, 0));
		renderer.camera.updateProjectionMatrix();
		//renderer.camera.position.set(5, 10, 5);

		console.log('rotation after lookat', renderer.camera.rotation);

		hooks.call('new_projection');
	}

	export function start() {
		hooks.register('resize', resize);
		reinterpret();
		renderer.renderer.setClearColor('darkgrey');
		// make the yaw, pitch
		yaw = new THREE.Group();
		yaw.rotation.y = Math.PI / 4;
		pitch = new THREE.Group();
		pitch.rotation.x = Math.PI / 3;
		yaw.add(pitch);
		yaw.updateMatrix();
		pitch.add(renderer.camera);
		pitch.updateMatrix();
		renderer.scene.add(yaw);
		// add the sun
		sun = new THREE.DirectionalLight('white', 0.5);
		sun.position.set(-10, 10, -10);
		sun.target.position.set(0, 0, 0);
		renderer.scene.add(sun);
		renderer.scene.add(sun.target);
	}

	function resize() {
		switch (type) {
			case 'orthographic top down':
			case 'orthographic isometric':
				let width = window.innerWidth;
				let height = window.innerHeight;
				renderer.camera.left = width / - 2;
				renderer.camera.right = width / 2;
				renderer.camera.top = height / 2;
				renderer.camera.bottom = height / - 2;
				renderer.camera.updateProjectionMatrix();
				break;
			case 'perspective top down':
			case 'perspective isometric':
				renderer.camera.aspect = window.innerWidth / window.innerHeight;
				renderer.camera.updateProjectionMatrix();
				break;
		}
	}

	export function loop() {

	}

	export function quit() {

	}

}

export default projection;