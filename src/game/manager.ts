/// holds things like the player object

import player from "./player.js";
import terrain from "./terrain.js";
import projection from "./projection.js";
import pts2 from "../util/pts2.js";
import lod from "./lod.js";
import view_needs_rename from "./view_needs_rename.js";

namespace game_manager {

	export let active = false

	const boo = 0

	export var gview: view_needs_rename
	export var gplayer: player

	export function init() {
	}

	export function start_new_game() {
		active = true;
		gview = view_needs_rename.make();
		gplayer = new player();
		projection.setup();
		new lod.world(10);
		terrain.simple_populate();
	}

	let wpos = [0, 0] as vec2;

	export function loop() {
		if (!active)
			return;
		gview.tick();
		lod.gworld.update(wpos);
		projection.loop();
	}
}

export default game_manager;