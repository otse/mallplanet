// as you guessed this is the intro 

import glob from "../lib/glob.js";
import hooks from "../lib/hooks.js";
import mkb from "../mkb.js";

import mall, { THREE } from "../mall.js";
import renderer from "../renderer.js";
import time from "../lib/timer.js";
import easings from "../lib/easings.js";

namespace main_menu {

	let time = 0

	let holder, logo

	function make_button(text) {
		let button = document.createElement('div');
		//button.setAttribute('id', 'main_menu')
		button.classList.add('button');
		button.innerHTML = text;
		return button;
	}

	export function boot() {
		holder = document.createElement('div');
		holder.setAttribute('id', 'main_menu');
		mall.page.append(holder);

		logo = document.createElement('div');
		logo.setAttribute('id', 'logo');
		logo.innerHTML = 'Mall Planet';
		holder.append(logo);

		let start = make_button('start');
		let quit = make_button('quit');

		holder.append(start);
		holder.append(quit);
	}

	export function cleanup() {
	}

	export function animate() {
	}
}

export default main_menu;