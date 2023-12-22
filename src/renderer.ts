import glob from "./util/glob.js";

import { THREE } from "./mall.js";

namespace renderer {
	const ad_hoc = 0

	export var renderer, scene, camera, clock, ambient

	function resize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function test_sphere() {
		let geometry = new THREE.SphereGeometry(1, 32, 16);
		let material = new THREE.MeshLambertMaterial({ wireframe: true, color: 'white' })
		let sphere = new THREE.Mesh(geometry, material);

		scene.add(sphere);
	}

	export function boot(word: string) {
		console.log(' boot renderer ');

		ambient = new THREE.AmbientLight(0xffffff);

		clock = new THREE.Clock();
		scene = new THREE.Scene();
		scene.add(ambient);
		camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
		camera.position.z = 10;

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize(1024, 768);
		renderer.setClearColor('grey');

		document.getElementById('webgl')!.append(renderer.domElement);

		window.addEventListener('resize', resize);

		resize();
	}

	export function load_image(file: string) {
        let texture = new THREE.TextureLoader().load(file + `?v=${glob.salt}`, () => 0);
		texture.generateMipmaps = false;
		//texture.center.set(0, 1);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

	export function render() {
		renderer.render(scene, camera);
	}

}

export default renderer;