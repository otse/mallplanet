import glob from "./glob.js";

import { THREE } from "./mall.js";

namespace renderer {
	const ad_hoc = 0

	var renderer, scene, camera

	export function boot() {
		
	}

	export function dom_ready(word: string) {
		console.log(' dom_ready renderer ');

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize(1024, 768);

		//glob.ipc.send('asynchronous-append', ['webgl', renderer.domElement]);
		document.getElementById('webgl')!.append(renderer.domElement);
	}

}

export default renderer;