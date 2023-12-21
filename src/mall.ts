import glob from "./glob.js";
import renderer from "./renderer.js";

namespace mall {
	const constant = 1

	export function boot() {
		console.log(' mall start ');

		renderer.boot();
	}

	export function dom_ready() {
		console.log(' mall dom ready ');
		
	}

	function ready(word: string) {
		console.log(' making mall ready ');

		renderer.ready(word);

	}

}

glob.mall = mall;

export default mall;