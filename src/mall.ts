import * as THREE from 'three';

export { THREE as THREE }; // just perfect (:)

import glob from "./glob.js";
import renderer from "./renderer.js";

namespace mall {
	const constant = 1

	export function boot() {
		console.log(' mall boot ');

		renderer.boot();

		glob.mall = mall;
		glob.t = THREE;

		dom_ready('');
	}

	function dom_ready(word: string) {
		console.log(' dom_ready mall ');

		renderer.dom_ready(word);

		requestAnimationFrame(renderer.render);
	}

}

console.log(' mall outside ');

glob.mall = mall;

mall.boot();

export default mall;