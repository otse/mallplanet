/// holds things like the player object

import pts2 from "../util/pts2.js";
import lod from "./lod.js";
import player from "./player.js";
import terrain from "./terrain.js";
import view_needs_rename from "./view_needs_rename.js";
import { colormap } from "./colormap.js";
import projection from "./projection.js";
import { THREE } from "../mall.js";
import renderer from "../renderer.js";

namespace game_manager {

	export let active = false

	const boo = 0

	export var gview: view_needs_rename
	export var gplayer: player
	export var gcolormap: colormap
	export var gheightmap: colormap

	export function init() {
	}

	export function start_new_game() {
		active = true;
		gcolormap = new colormap('colormap');
		gheightmap = new colormap('heightmap');
		gview = view_needs_rename.make();
		gplayer = new player();
		projection.start();
		terrain.simple_populate();
	}

	let wpos = [0, 0] as vec2;

	export function think() {
		if (!active)
			return;
		gview.think();
		projection.loop();
	}
}

export default game_manager;