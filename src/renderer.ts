import glob from "./glob.js";

import { THREE } from "./mall.js";

namespace renderer {
	const ad_hoc = 0

	var renderer, scene, camera

	export function boot() {
		
	}

	export function dom_ready(word: string) {
		console.log(' dom_ready renderer ');

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, 1024 / 768, 1, 1000);
		camera.position.z = 10;

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize(1024, 768);

		document.getElementById('webgl')!.append(renderer.domElement);

		renderer.setClearColor('grey');

		let geometry = new THREE.SphereGeometry(1, 32, 16);
		let material = new THREE.MeshLambertMaterial({ wireframe: true, color: 'white' })
		let sphere = new THREE.Mesh(geometry, material);

		scene.add(sphere);
	}

	export function render() {
		renderer.render(scene, camera);
	}

}

export default renderer;