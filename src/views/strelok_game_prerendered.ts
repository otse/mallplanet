/// a 3d logo was very amaturish so i turned this into a gif

import glob from "../util/glob.js";
import hooks from "../util/hooks.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";

import mall, { THREE } from "../mall.js";
import timer from "../util/timer.js";
import easings from "../util/easings.js";
import snd from "../snd.js";

namespace strelok_game_prerendered {
	export var next

	let timerr: timer

	export function start() {
		
		mall.view = this;

		mall.whole.style.background = 'black';
		mall.whole.innerHTML = `<img src="./img/strelok_game_prerendered.gif" />`;

		hooks.register('mall_planet_animate', animate);

		timerr = new timer(3);
	}

	export function cleanup() {
		mall.whole.innerHTML = '';
		next?.start();
		hooks.unregister('mall_planet_animate', animate);
	}

	export function animate() {
		if (mkb.key_state('escape') == 1 || timerr.done()) {
			cleanup();
		}
	}
}

export default strelok_game_prerendered;