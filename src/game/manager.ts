import pts from "../util/pts.js";
import hooks from "../util/hooks.js";

import { colormap, pixel } from "../util/colormap.js";
import mall, { THREE, BufferGeometryUtils } from "../mall.js";

import * as game from "./re-exports.js"
import renderer from "../renderer.js";

namespace manager {

	export namespace tallies {
		export var bakeds: game.lod.calories = [0, 0]
		export var tiles: game.lod.calories = [0, 0]
		export var walls: game.lod.calories = [0, 0]
		export var shadows: game.lod.calories = [0, 0]
	}

	export let active = false

	const boo = 0

	export var view: game.view_needs_rename
	export var ply: game.player

	export var colormap_: colormap
	export var heightmap: colormap
	export var wallmap: colormap

	export function init() {
	}

	export function start_new_game() {
		active = true;
		colormap_ = new colormap('colormap');
		heightmap = new colormap('heightmap');
		wallmap = new colormap('wallmap');
		view = new game.view_needs_rename();
		hook_in_to_the_lod();
		ply = new game.player();
		ply.wpos = [23, 28];
		game.lod.add(ply);
		game.projection.start();
		view.follow = ply;
		// Make car
		let car = new game.car();
		car.wpos = [10, 22];
		game.lod.add(car);
	}

	let wpos = [0, 0] as vec2;

	export function think() {
		if (!active)
			return;
		game.projection.think();
		view.think();
		ply.priority_update();
		view.update();
	}

	export function factory<type extends game.superobject>(
		type: { new(): type }, pixel: pixel, wpos: vec2, hint: any) {
		let obj = new type;
		obj.wpos = wpos;
		obj.pixel = pixel;
		obj.hint = hint;
		game.lod.add(obj);
		return obj;
	}

	/*export function unused_factory_when<type extends game.superobject>(type: { new(): type }, map: colormap, pos: vec2, color: vec3) {
		let pixel = wallmap.pixel(pos);
		if (pixel.is_color(color))
			factory(type, pixel, pos);
	}*/

	function hook_in_to_the_lod() {
		// Last registered hooks get called first

		hooks.register('lod_chunk_create', (chunk: game.lod.chunk) => {
			pts.func(chunk.small, (pos) => {
			});
			return false;
		});

		hooks.register('lod_chunk_create', (chunk: game.lod.chunk) => {
			// Create walls and floors
			pts.func(chunk.small, (pos) => {
				let pixel = wallmap.pixel(pos);
				if (pixel.is_color(game.colormap_values.wall_brick))
					factory(game.wall, pixel, pos, 'brick wall');
				else if (pixel.is_color(game.colormap_values.tile_kitchen))
					factory(game.floor, pixel, pos, 'kitchen floor');
				else if (pixel.is_color(game.colormap_values.tile_wood))
					factory(game.floor, pixel, pos, 'wooden floor');
			});
		});

		hooks.register('lod_chunk_create', (chunk: game.lod.chunk) => {
			chunk.group = new THREE.Group();
			chunk.group.name = 'a chunk group';
		});

		hooks.register('lod_chunk_hide', (chunk: game.lod.chunk) => {
			chunk.group.parent.remove(chunk.group);
			chunk.group.children = [];
		});

		hooks.register('lod_chunk_show', (chunk: game.lod.chunk) => {
			renderer.game_objects.add(chunk.group);
		});

		function bake(chunk: game.lod.chunk, type, hint) {
			let filtered = game.baked.filter(chunk, type, hint);
			if (filtered.length < 2)
				return;
			const baked = new game.baked();
			baked.wpos = chunk.small.center();
			baked.match_type = type;
			baked.match_hint = hint;
			game.lod.add(baked);
		}

		hooks.register('lod_chunk_show', (chunk: game.lod.chunk) => {
			bake(chunk, 'a floor', 'kitchen floor');
			bake(chunk, 'a floor', 'wooden floor');
			bake(chunk, 'a wall', 'brick wall -vert');
			bake(chunk, 'a wall', 'brick wall -horz');
			bake(chunk, 'an obj', 'brick wall -shadow');
			bake(chunk, 'an obj', 'brick wall -box');
		});

	}
}

export default manager;