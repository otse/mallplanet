// as you guessed this is the intro 

import glob from "../util/glob.js";
import hooks from "../util/hooks.js";
import mkb from "../mkb.js";

import mall, { THREE } from "../mall.js";
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

	export function start() {
		mall.view = this;

		fader = document.createElement('div'); 
		fader.setAttribute('id', 'fader');
		mall.whole.append(fader);
		setTimeout(() => { fader.remove() }, 4000);

		holder = document.createElement('div');
		holder.setAttribute('id', 'main_menu');
		mall.whole.append(holder);

		logo = document.createElement('div');
		logo.setAttribute('id', 'logo');
		logo.innerHTML = 'MallPlanet';
		holder.append(logo);

		let start = make_button('start');
		let quit = make_button('quit');

		start.onclick = () => {
			main_menu.cleanup();
			manager.start_new_game();
		};

		holder.append(start);
		holder.append(quit);

		music = snd.play_regular('blurringmyday', 0.5, true);

		hooks.register('mall_planet_animate', animate);
	}

	export function cleanup() {
		mall.whole.style.background = 'transparent';
		mall.whole.innerHTML = '';
		music.stop();
		hooks.unregister('mall_planet_animate', animate);
	}

	export function animate() {
	}
}

export default main_menu;