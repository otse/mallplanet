/// the load screen for mall

// sounds can take several sounds so a load indicator is welcome

import mall from "../mall.js";
import renderer from "../renderer.js";
import strelok_game from "./strelok_game.js";

namespace load_screen {
	export var next
	export var things_to_load = 0
	export var things_loaded = 0

	export var emojis = ['🐔'] // '🐑', '🐖', '🐉', '🍄', '🐢', 

	let whole, last, bar

	export function boot(mall) {
		start(mall);
	}

	export function start(mall) {
		whole = document.createElement('div');
		whole.setAttribute('id', 'load_screen');
		mall.whole.append(whole);

		whole.innerHTML = `
		<div id="last"></div>
		<br />
		<div id="bar"></div>
		`;
		last = whole.querySelector('#last');
		bar = whole.querySelector('#bar');

		next = strelok_game;
	}

	export function cleanup() {
		whole.remove();
		next?.start();
	}

	export function increment(asset = './') {
		const thing = document.createElement('div');
		thing.classList.add('thing');
		thing.innerHTML = mall.sample(emojis);
		bar.append(thing);
		things_loaded++;
		last.innerHTML = `${asset}`;
		if (things_loaded >= things_to_load) {
			console.log(' load screen done ');
			setTimeout(cleanup, 500);
		}
	}

	export function animate() {

	}
}

export default load_screen;