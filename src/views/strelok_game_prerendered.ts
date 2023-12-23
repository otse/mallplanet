/// a 3d logo was very amaturish so i turned this into a gif

import glob from "../util/glob.js";
import hooks from "../util/hooks.js";
import mkb from "../mkb.js";
import renderer from "../renderer.js";

import mall, { THREE } from "../mall.js";
import time from "../util/timer.js";
import easings from "../util/easings.js";
import snd from "../snd.js";

namespace strelok_game_prerendered {
	export var next

	let timer

	export function start() {
		
		mall.view = this;

		mall.whole.style.background = 'black';
		mall.whole.innerHTML = `<img src="./img/strelok_game_prerendered.gif" />`;

		hooks.register('mallAnimate', animate);

		timer = time(3);
	}

	export function cleanup() {
		mall.whole.innerHTML = '';
		next?.start();
		hooks.unregister('mallAnimate', animate);
	}

	export function animate() {
		if (mkb.key('escape') == 1 || timer.done()) {
			cleanup();
		}
	}
}

export default strelok_game_prerendered;