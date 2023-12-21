import * as THREE from 'three';

export { THREE as THREE }; // just perfect (:)

import glob from "./lib/glob.js";
import renderer from "./renderer.js";
import startup from './views/startup.js';
import { hooks } from './lib/hooks.js';
import mkb from './mkb.js';
import main_menu from './views/mainmenu.js';


namespace mall {
	const constant = 1

	export var page

	export function sample(a) {
		return a[Math.floor(Math.random() * a.length)];
	}

	export function clamp(val, min, max) {
		return val > max ? max : val < min ? min : val;
	}

	export function boot() {
		glob.salt = '';
		console.log(' boot mall ');
		page = document.getElementById('page');
		mkb.attach_listeners();
		renderer.boot('');
		startup.boot();
		startup.next = main_menu;
		requestAnimationFrame(animate);
	}

	let last
	function animate(time) {
		glob.delta = (time - (last || time)) / 1000;
		last = time;
		requestAnimationFrame(animate);
		hooks.call('mallAnimate', 0);
		renderer.render();
	}

}

console.log(' mall outside ');

glob.mall = mall;

mall.boot();

export default mall;