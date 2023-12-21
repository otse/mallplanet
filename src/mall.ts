import * as THREE from 'three';

export { THREE as THREE }; // just perfect (:)

import glob from "./lib/glob.js";
import renderer from "./renderer.js";

namespace mall {
	const constant = 1

	export function boot() {
		console.log(' boot mall ');
		renderer.boot('');
		requestAnimationFrame(renderer.render);
	}

}

console.log(' mall outside ');

glob.mall = mall;

mall.boot();

export default mall;