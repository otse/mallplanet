import glob from "./lib/glob.js";

import { THREE } from "./mall.js";

namespace renderer {
	const ad_hoc = 0

	var renderer, scene, camera, clock

	function resize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	export function boot(word: string) {
		console.log(' boot renderer ');

		clock = new THREE.Clock();
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
		camera.position.z = 10;

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize(1024, 768);
		renderer.setClearColor('grey');

		document.getElementById('webgl')!.append(renderer.domElement);

		let geometry = new THREE.SphereGeometry(1, 32, 16);
		let material = new THREE.MeshLambertMaterial({ wireframe: true, color: 'white' })
		let sphere = new THREE.Mesh(geometry, material);

		scene.add(sphere);

		window.addEventListener('resize', resize);
		resize();
	}

	export function render() {
		requestAnimationFrame(render);
		const delta = clock.getDelta();
		glob.delta = delta;
		renderer.render(scene, camera);
	}

}

export default renderer;