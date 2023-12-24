import glob from "./util/glob.js";
import hooks from "./util/hooks.js";

import { THREE } from "./mall.js";

namespace renderer {
	export var ndpi = 1

	const ad_hoc = 0

	export var renderer, scene, camera, clock, ambient, game_objects

	export function resize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		hooks.call('resize');

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

		console.log('THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE', THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE);

		THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = false;

		ambient = new THREE.AmbientLight(0xffffff);

		clock = new THREE.Clock();
		scene = new THREE.Scene();
		scene.add(ambient);
		camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
		camera.position.z = 10;

		game_objects = new THREE.Group();
		//game_objects.rotation.set(Math.PI / 6, Math.PI / 4, 0);
		//game_objects.updateMatrix();

		scene.add(game_objects);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(1024, 768);
		renderer.setClearColor('grey');
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		document.getElementById('webgl')!.append(renderer.domElement);

		window.addEventListener('resize', resize);

		resize();
	}

	export function load_image(file: string) {
		let texture = new THREE.TextureLoader().load(file + `?v=${glob.salt}`);
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