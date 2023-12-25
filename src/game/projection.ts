import { THREE } from "../mall.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";
import hooks from "../util/hooks.js";

import * as game from "./re-exports.js"

// We maintain multiple projections because we can

namespace projection {

	export enum type {
		orthographic_top_down,
		perspective_top_down,
		orthographic_dimetric,
		orthographic_isometric,
		perspective_isometric,
		length
	}

	export function debug() {
		return `${type[current]} (${current + 1})`;
	}

	export var current: type = type.orthographic_top_down

	export var yaw, pitch, zoom

	var sun

	export function change() {
		const orthographic = () => {
			renderer.camera = new THREE.OrthographicCamera(
				0, 0, 0, 0, 1, 1000);
		}
		const perspective = () => {
			renderer.camera = new THREE.PerspectiveCamera(
				45, 1, 1, 1000);
		}
		switch (current) {
			case type.orthographic_top_down:
				orthographic();
				yaw.rotation.y = 0;
				pitch.rotation.x = 0;
				zoom = 20;
				break;
			case type.orthographic_dimetric:
				orthographic();
				yaw.rotation.y = Math.PI / 4;
				pitch.rotation.x = Math.PI / 3;
				zoom = 40;
				break;
			case type.orthographic_isometric:
				orthographic();
				yaw.rotation.y = Math.PI / 4;
				pitch.rotation.x = Math.PI / 4;
				zoom = 40;
				break;
			case type.perspective_top_down:
				perspective();
				yaw.rotation.y = 0;
				pitch.rotation.x = 0;
				zoom = 1;
				break;
			case type.perspective_isometric:
				perspective();
				yaw.rotation.y = Math.PI / 4;

				pitch.rotation.x = Math.PI / 3;
				zoom = 1;
				break;
		}
		resize();
		while (pitch.children.length)
			pitch.remove(pitch.children[0]);
		pitch.updateMatrix();
		pitch.add(renderer.camera);
		renderer.camera.position.set(0, 40, 0);
		renderer.camera.rotation.x = -Math.PI / 2;
		renderer.camera.updateMatrix();
		renderer.camera.updateProjectionMatrix();
	}

	export function start() {
		hooks.register('resize', resize);
		renderer.renderer.setClearColor('darkgrey');
		renderer.ambient.color.copy(new THREE.Color('#777'));
		// make the yaw, pitch
		zoom = 10;
		yaw = new THREE.Group();
		yaw.rotation.y = Math.PI / 4;
		pitch = new THREE.Group();
		pitch.rotation.x = Math.PI / 3;
		yaw.add(pitch);
		yaw.updateMatrix();
		pitch.updateMatrix();
		renderer.scene.add(yaw);
		// now swap
		change();
		pitch.add(renderer.camera);
		// add the sun
		sun = new THREE.DirectionalLight('white', 1);
		sun.position.set(5, 10, 7.5);
		sun.updateMatrix();
		sun.target.position.set(0, 0, 0);
		sun.target.updateMatrix();
		renderer.scene.add(sun);
		renderer.scene.add(sun.target);
	}

	export function think() {
		if (mkb.key('f2') == 1) {
			current = current < type.length - 1 ? current + 1 : 0;
			change();
		}
	}

	function resize() {
		switch (current) {
			case type.orthographic_top_down:
			case type.orthographic_dimetric:
			case type.orthographic_isometric:
				let width = window.innerWidth;
				let height = window.innerHeight;
				renderer.camera.left = width / - 2;
				renderer.camera.right = width / 2;
				renderer.camera.top = height / 2;
				renderer.camera.bottom = height / - 2;
				renderer.camera.updateProjectionMatrix();
				break;
			case type.perspective_top_down:
			case type.perspective_isometric:
				renderer.camera.aspect = window.innerWidth / window.innerHeight;
				renderer.camera.updateProjectionMatrix();
				break;
		}
	}

	export function quit() {

	}

}

export default projection;