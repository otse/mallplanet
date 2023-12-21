// as you guessed this is the intro 

import glob from "../lib/glob.js";
import hooks from "../lib/hooks.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";

import { THREE } from "../mall.js";
import time from "../lib/timer.js";
import easings from "../lib/easings.js";

namespace startup {
	const seconds = 4
	var plane, ambient, lamp

	export function boot() {

		renderer.renderer.setClearColor('black');

		hooks.register('mallAnimate', animate);
	}

	export function cleanup() {
		renderer.renderer.setClearColor('grey');
	}

	let timer = time(5)
	export function animate() {
		if (mkb.key('escape') || timer.done()) {
			hooks.unregister('mallAnimate', animate);
			cleanup();
		}
	}
}

export default startup;