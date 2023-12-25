import pts from "../util/pts.js";
import hooks from "../util/hooks.js";

import { colormap, pixel } from "../util/colormap.js";
import mall, { THREE } from "../mall.js";

import * as game from "./re-exports.js"

namespace manager {

	export let active = false

	const boo = 0

	export var view: game.view_needs_rename
	export var ply: game.player
	
	export var colormap_: colormap
	export var heightmap: colormap
	export var wallmap: colormap
	export var floormap: colormap

	export function init() {
	}

	export function start_new_game() {
		active = true;
		colormap_ = new colormap('colormap');
		heightmap = new colormap('heightmap');
		wallmap = new colormap('wallmap');
		floormap = new colormap('floormap');
		view = game.view_needs_rename.make();
		ply = new game.player();
		game.projection.start();
		setup_colormap_hooks();
	}

	let wpos = [0, 0] as vec2;

	export function think() {
		if (!active)
			return;
		game.projection.think();
		view.think();
	}
	
	export function factory<type extends game.superobject>(type: { new(): type }, pixel, wpos) {
		let obj = new type;
		obj.wpos = wpos;
		obj.pixel = pixel;
		game.lod.add(obj);
		return obj;
	}

	function setup_colormap_hooks() {
		// We register to the lod here
		hooks.register('lod_chunk_create', (chunk: game.lod.chunk) => {
			pts.func(chunk.small, (pos) => {
				let pixel = floormap.pixel(pos);
				if (pixel.is_color(game.colormap_values.color_kitchen_tiles)) {
					factory(game.floors.tile, pixel, pos);
				}
			})
			return false;
		})
	}
}

export default manager;