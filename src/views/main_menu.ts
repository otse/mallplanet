// as you guessed this is the intro 

import glob from "../util/glob.js";
import hooks from "../util/hooks.js";
import mkb from "../mkb.js";

import mall, { THREE } from "../mall.js";
import renderer from "../renderer.js";
import time from "../util/timer.js";
import easings from "../util/easings.js";
import manager from "../game/manager.js";
import snd from "../snd.js";

namespace main_menu {

	let time = 0

	let music
	let fader, holder, logo

	function make_button(text) {
		let button = document.createElement('div');
		//button.setAttribute('id', 'main_menu')
		button.classList.add('button');
		button.innerHTML = text;
		return button;
	}

	export function boot() {
		fader = document.createElement('div');
		fader.setAttribute('id', 'fader');
		mall.whole.append(fader);
		setTimeout(() => { fader.remove() }, 3000);

		holder = document.createElement('div');
		holder.setAttribute('id', 'main_menu');
		mall.whole.append(holder);

		logo = document.createElement('div');
		logo.setAttribute('id', 'logo');
		logo.innerHTML = 'Mall Planet';
		holder.append(logo);

		let start = make_button('start');
		let quit = make_button('quit');

		start.onclick = () => {
			//entry
			console.log('boo');
			manager.start_new_game();

		};

		holder.append(start);
		holder.append(quit);

		music = snd.play_regular('blurringmyday', 0.5, true);
	}

	export function cleanup() {
		music.stop();
	}

	export function animate() {
	}
}

export default main_menu;