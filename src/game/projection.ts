import { THREE } from "../mall.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";
import hooks from "../util/hooks.js";
import pts from "../util/pts.js";

import * as game from "./re-exports.js"

// We only need 1 projection tho

namespace projection {

	export enum enum_ {
		orthographic_top_down,
		perspective_top_down,
		orthographic_dimetric,
		orthographic_isometric,
		perspective_isometric,
		length
	}

	export function debug() {
		return `#${value + 1} ${enum_[value]}`;
	}

	export var hit: vec2 = [0, 0]
	export var pointer, raycaster, intersection, point

	export var value = enum_.orthographic_top_down

	export var yaw, pitch, yup, zoom

	export var mousemarker

	var sun

	export function change_projection() {
		const orthographic = () => {
			renderer.camera = new THREE.OrthographicCamera(
				0, 0, 0, 0, 1, 1000);
		}
		const perspective = () => {
			renderer.camera = new THREE.PerspectiveCamera(
				45, 1, 1, 1000);
		}
		switch (value) {
			case enum_.orthographic_top_down:
				orthographic();
				yaw.rotation.y = 0;
				pitch.rotation.x = 0;
				zoom = 2;
				break;
			case enum_.orthographic_dimetric:
				orthographic();
				yaw.rotation.y = Math.PI / 4;
				pitch.rotation.x = Math.PI / 3;
				zoom = 10;
				yup = 400;
				break;
			case enum_.orthographic_isometric:
				orthographic();
				yaw.rotation.y = Math.PI / 4;
				pitch.rotation.x = Math.PI / 4;
				zoom = 2;
				break;
			case enum_.perspective_top_down:
				perspective();
				yaw.rotation.y = 0;
				pitch.rotation.x = 0;
				zoom = 1;
				yup = 200;
				break;
			case enum_.perspective_isometric:
				perspective();
				yaw.rotation.y = Math.PI / 4;
				pitch.rotation.x = Math.PI / 3;
				zoom = 1;
				yup = 200;
				break;
		}
		resize();
		while (pitch.children.length)
			pitch.remove(pitch.children[0]);
		pitch.updateMatrix();
		pitch.add(renderer.camera);
		renderer.camera.position.set(0, yup, 0);
		renderer.camera.rotation.x = -Math.PI / 2;
		renderer.camera.updateMatrix();
		renderer.camera.updateProjectionMatrix();
	}

	export function update_mousemarker() {
		let mouse = [pointer.x, pointer.y];
		/*let worldPoint = new THREE.Vector3();
		worldPoint.x = pointer.x;
		worldPoint.y = pointer.y;
		worldPoint.z = 0;
		worldPoint.unproject(renderer.camera);*/
		mousemarker.position.set(point.x, 0, point.z);
		mousemarker.updateMatrix();
		//return [worldPoint.x, worldPoint.y];
	}

	export function reset_pointer() {
		let mouse = mkb.mouse_pos();
		//mouse = pts.add(mouse, game.manager.view.rpos);
		pointer.x = (mouse[0] / window.innerWidth) * 2 - 1;
		pointer.y = - (mouse[1] / window.innerHeight) * 2 + 1;
		//console.log(pointer);
		
		renderer.camera.updateMatrixWorld();
		raycaster.setFromCamera(pointer, renderer.camera);
		raycaster.params.Points.threshold = 1;
		const intersections = raycaster.intersectObjects([flatgrass], true);
		intersection = (intersections.length) > 0 ? intersections[0] : null;
		if (intersection) {
			point = intersection.point;
			hit = [point.x, point.z];
		}
	}

	let flatgrass
	export function start() {
		hooks.register('resize', resize);
		renderer.renderer.setClearColor('darkgrey');
		renderer.ambient.color.copy(new THREE.Color('white'));
		// Set pointer for use in projection
		let geometry = new THREE.PlaneGeometry(100000, 100000);
		geometry.rotateX(-Math.PI / 2);
		flatgrass = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 'blue'}));
		flatgrass.visible = true;
		point = new THREE.Vector2();
		pointer = new THREE.Vector2();
		raycaster = new THREE.Raycaster();
		// Make yaw, pitch
		yup = 200;
		zoom = 10;
		yaw = new THREE.Group();
		yaw.rotation.y = Math.PI / 4;
		pitch = new THREE.Group();
		pitch.rotation.x = Math.PI / 3;
		yaw.add(pitch);
		yaw.add(new THREE.AxesHelper(2));
		yaw.updateMatrix();
		pitch.updateMatrix();
		pitch.add(renderer.camera);
		mousemarker = new THREE.AxesHelper(5);
		renderer.scene.add(mousemarker);
		renderer.scene.add(yaw);
		change_projection(); // Set the settings
		// Add the sun
		sun = new THREE.DirectionalLight('white', 1);
		sun.position.set(5, 10, 7.5);
		sun.updateMatrix();
		sun.target.position.set(0, 0, 0);
		sun.target.updateMatrix();
		//renderer.scene.add(sun);
		//renderer.scene.add(sun.target);
	}

	export function unproject_mouse(mouse: vec2) {
		switch (value) {
			case enum_.orthographic_dimetric:
			case enum_.orthographic_isometric:
			case enum_.orthographic_top_down:
				return mouse;
			default:
		}
		let worldPoint = new THREE.Vector3();
		worldPoint.x = mouse[0];
		worldPoint.y = 0;
		worldPoint.z = mouse[1];
		worldPoint.unproject(renderer.camera);
		return [worldPoint.x, worldPoint.z] as vec2;
	}

	export function think() {
		reset_pointer();
		update_mousemarker();
		if (mkb.key_state('f2') == 1) {
			value = value < enum_.length - 1 ? value + 1 : 0;
			change_projection();
		}
	}

	function resize() {
		switch (value) {
			case enum_.orthographic_top_down:
			case enum_.orthographic_dimetric:
			case enum_.orthographic_isometric:
				let width = window.innerWidth;
				let height = window.innerHeight;
				renderer.camera.left = width / - 2;
				renderer.camera.right = width / 2;
				renderer.camera.top = height / 2;
				renderer.camera.bottom = height / - 2;
				renderer.camera.updateProjectionMatrix();
				break;
			case enum_.perspective_top_down:
			case enum_.perspective_isometric:
				renderer.camera.aspect = window.innerWidth / window.innerHeight;
				renderer.camera.updateProjectionMatrix();
				break;
		}
	}

}

export default projection;