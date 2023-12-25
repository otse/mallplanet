/// the load screen for mall

// sounds can take several seconds so a load indicator was welcome

import hooks from "../util/hooks.js";
import manager from "../game/manager.js";
import mall from "../mall.js";
import mkb from "../mkb.js";
import time, { timer } from "../util/timer.js";

namespace loading_screen {
	export var next
	export var things_to_load = 0
	export var things_loaded = 0
	export var done

	export var emojis = ['🐔'] // '🐑', '🐖', '🐉', '🍄', '🐢', 

	let whole, last, bar

	let delay: timer
	let timeout
	let skipping

	export function start(mall) {
		mall.view = this;
		whole = document.createElement('div');
		whole.setAttribute('id', 'load_screen');
		mall.whole.append(whole);

		whole.innerHTML = `
		<div id="skip_hint">(tap space to launch into game)</div>
		<div id="last"></div>
		<br />
		<div id="bar"></div>
		`;
		last = whole.querySelector('#last');
		bar = whole.querySelector('#bar');

		hooks.register('mall_planet_animate', animate);
	}

	export function cleanup() {
		whole.remove();
		next?.start();
		hooks.unregister('mall_planet_animate', animate);
	}

	export function increment(asset = './') {
		const thing = document.createElement('div');
		thing.classList.add('thing');
		thing.innerHTML = mall.sample(emojis);
		bar.append(thing);
		things_loaded++;
		last.innerHTML = `${asset}`;
		if (things_loaded >= things_to_load) {
			done = true;
			delay = time(0.5);
		}
	}

	export function animate() {
		if (!done)
			return;
		if (delay.done()) {
			cleanup();
		}
		else if (mkb.key_state(' ') == 1) {
			// go straight into game
			console.log(' skipping ');
			skipping = true;
			next = undefined;
			cleanup();
			manager.start_new_game();
		}
	}
}

export default loading_screen;