// as you guessed this is the intro 

import glob from "../util/glob.js";
import hooks from "../util/hooks.js";
import mkb from "../mkb.js";

import mall, { THREE } from "../mall.js";
import time, { timer } from "../util/timer.js";

namespace denatsu_games {
	export var next

	let timer: timer

	export function start() {
		mall.view = this;

		mall.whole.style.background = 'black';
		mall.whole.innerHTML = `<img src="./img/denatsu_games.jpg" />`;

		hooks.register('mall_planet_animate', animate);

		timer = time(2);

		mall.view = this;
	}

	export function cleanup() {
		mall.whole.innerHTML = '';
		next?.start();
		hooks.unregister('mall_planet_animate', animate);
	}

	export function animate() {
		if (mkb.key_state('escape') == 1 || timer.done()) {
			cleanup();
		}
	}
}

export default denatsu_games;