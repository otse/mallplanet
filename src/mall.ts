import * as THREE from 'three';

export { THREE as THREE }; // just perfect (:)

import hooks from './util/hooks.js';
import glob from "./util/glob.js";
import renderer from "./renderer.js";
import strelok_game from './views/strelok_game.js';
import strelok_game_prerendered from './views/strelok_game_prerendered.js';
import denatsu_games from './views/denatsu_games.js';
import mkb from './mkb.js';
import snd from './snd.js';
import load_screen from './views/load_screen.js';
import main_menu from './views/main_menu.js';
import game_manager from './game/manager.js';


namespace mall {
	const constant = 1
	
	export var view
	export var whole

	export function sample(a) {
		return a[Math.floor(Math.random() * a.length)];
	}

	export function clamp(val, min, max) {
		return val > max ? max : val < min ? min : val;
	}

	export function boot() {
		glob.salt = '';
		console.log(' boot mall ');
		whole = document.getElementById('page');
		mkb.attach_listeners();
		renderer.boot('');
		load_screen.start(this);
		load_screen.next = denatsu_games;
		denatsu_games.next = strelok_game_prerendered;
		strelok_game_prerendered.next = main_menu;
		snd.boot();
		requestAnimationFrame(animate);
	}

	let last
	function animate(time) {
		glob.delta = (time - (last || time)) / 1000;
		last = time;
		requestAnimationFrame(animate);
		hooks.call('mallAnimate', 0);
		game_manager.loop();
		renderer.render();
		mkb.loop();
	}

}

glob.mall = mall;

(window as any).mall = mall;

export default mall;