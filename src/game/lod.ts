import hooks from "../util/hooks.js"
import pts from "../util/pts.js"
import aabb from "../util/aabb.js"

// Internal class
class toggle {
	protected _active = false
	public get active() { return this._active; }
	on() {
		if (this._active)
			return true;
		this._active = true;
		return false;
	}
	off() {
		if (!this._active)
			return true;
		this._active = false;
		return false;
	}
}

namespace lod {

	export const size = 8

	const chunk_coloration = true

	const fog_of_war = false

	const grid_crawl_makes_chunks = true

	export const chunk_span = 8

	export type calories = [active: number, total: number]

	export var chunks: calories = [0, 0]

	// Yep like singletons
	export var gworld: world
	export var ggrid: grid

	export function register() {
	}

	export function project(unit: vec2): vec2 {
		return pts.mult(unit, lod.size);
	}

	export function unproject(pixel: vec2): vec2 {
		return pts.divide(pixel, lod.size);
	}

	export function add(obj: obj) {
		let chunk = gworld.at(lod.world.big(obj.wpos));
		chunk.add(obj);
	}

	export function remove(obj: obj) {
		obj.chunk?.remove(obj);
	}

	export class world {
		readonly arrays: chunk[][] = []
		constructor(dummy) {
			gworld = this;
			new grid(4, 4);
		}
		update(wpos: vec2) {
			ggrid.big = lod.world.big(wpos);
			ggrid.ons();
			ggrid.offs();
		}
		lookup(big: vec2): chunk | undefined {
			if (this.arrays[big[1]] == undefined)
				this.arrays[big[1]] = [];
			return this.arrays[big[1]][big[0]];
		}
		at(big: vec2): chunk {
			return this.lookup(big) || this.make(big);
		}
		protected make(big): chunk {
			let s = this.lookup(big);
			if (s)
				return s;
			s = this.arrays[big[1]][big[0]] = new chunk(big, this);
			return s;
		}
		static big(units: vec2): vec2 {
			return pts.floor(pts.divide(units, chunk_span));
		}
	}

	export class chunk extends toggle {
		static total = 0
		color
		fog_of_war = false
		readonly small: aabb
		readonly objs: obj[] = []
		constructor(
			public readonly big: vec2,
			readonly world: world
		) {
			super();
			if (chunk_coloration)
				this.color = (['lightsalmon', 'lightblue', 'beige', 'pink'])[Math.floor(Math.random() * 4)];
			let min = pts.mult(this.big, chunk_span);
			let max = pts.add(min, [chunk_span - 1, chunk_span - 1]);
			this.small = new aabb(max, min);
			chunks[1]++;
			world.arrays[this.big[1]][this.big[0]] = this;
			//console.log('sector');
			chunk.total++;
			hooks.call('lod_chunk_create', this);
		}
		add(obj: obj) {
			let i = this.objs.indexOf(obj);
			if (i == -1) {
				this.objs.push(obj);
				obj.chunk = this;
				if (this.active && !obj.active)
					obj.show();
			}
		}
		stacked(wpos: vec2) {
			let stack: obj[] = [];
			for (let obj of this.objs)
				if (pts.same(wpos, pts.round(obj.wpos)))
					stack.push(obj);
			return stack;
		}
		remove(obj: obj): boolean | undefined {
			let i = this.objs.indexOf(obj);
			if (i > -1) {
				obj.chunk = null;
				return !!this.objs.splice(i, 1).length;
			}
		}
		static swap(obj: obj) {
			// Call me whenever you move
			let oldChunk = obj.chunk!;
			let newChunk = oldChunk.world.at(lod.world.big(pts.round(obj.wpos)));
			if (oldChunk != newChunk) {
				oldChunk.remove(obj);
				newChunk.add(obj);
				if (!newChunk.active)
					obj.hide();
			}
		}
		think() {
			hooks.call('lod_chunk_think', this);
			//for (let obj of this.objs)
			//	obj.think();
		}
		show() {
			if (this.on())
				return;
			chunks[0]++;
			for (let obj of this.objs)
				obj.show();
			hooks.call('lod_chunk_show', this);
		}
		hide() {
			if (this.off())
				return;
			chunks[0]--;
			for (let obj of this.objs)
				obj.hide();
			hooks.call('lod_chunk_hide', this);
		}
		dist() {
			return pts.distsimple(this.big, lod.ggrid.big);
		}
		grayscale() {
			this.color = 'gray';
		}
	}

	export class grid {
		big: vec2 = [0, 0]
		public shown: chunk[] = []
		visibleObjs: obj[] = []
		constructor(
			public spread: number,
			public outside: number
		) {
			lod.ggrid = this;
			if (this.outside < this.spread) {
				console.warn(' lod: outside less than spread ', this.spread, this.outside);
				this.outside = this.spread;
			}
		}
		grow() {
			this.spread++;
			this.outside++;
		}
		shrink() {
			this.spread--;
			this.outside--;
		}
		visible(chunk: chunk) {
			return chunk.dist() < this.spread;
		}
		ons() {
			// spread = -2; < 2
			for (let y = -this.spread; y < this.spread + 1; y++) {
				for (let x = -this.spread; x < this.spread + 1; x++) {
					let pos = pts.add(this.big, [x, y]);
					let chunk = grid_crawl_makes_chunks ? gworld.at(pos) : gworld.lookup(pos);
					if (!chunk)
						continue;
					if (!chunk.active) {
						this.shown.push(chunk);
						chunk.show();
						//for (let obj of chunk.objs)
						//	obj.think();
						// Todo why do we think here
					}
				}
			}
		}
		offs() {
			// Hide chunks
			this.visibleObjs = [];
			let i = this.shown.length;
			while (i--) {
				let chunk: chunk;
				chunk = this.shown[i];
				if (chunk.dist() > this.outside) {
					chunk.hide();
					this.shown.splice(i, 1);
				}
				else {
					chunk.think();
					this.visibleObjs = this.visibleObjs.concat(chunk.objs);
				}

				if (fog_of_war) {
					if (chunk.dist() == this.outside) {
						//console.log('brim-chunk');
						chunk.fog_of_war = true;
						//sector.color = '#555555';
					}
					else {
						chunk.fog_of_war = false;
						//sector.color = '#ffffff';
					}
				}
			}
		}
		think() {
			for (let chunk of this.shown)
				for (let obj of chunk.objs)
					obj.think();
		}
	}

	interface ObjHints {

	};

	export class obj extends toggle {
		type = 'an obj'
		wpos: vec2 = [0, 0]
		rpos: vec2 = [0, 0]
		size: vec2 = [100, 100]
		chunk: chunk | null
		bound: aabb
		expand = .5
		constructor(
			public readonly counts: calories = [0, 0]) {
			super();
			this.counts[1]++;
		}
		finalize() {
			// this.hide();
			this.counts[1]--;
		}
		show() {
			if (this.on())
				return;
			this.counts[0]++;
			this.create();
		}
		hide() {
			if (this.off())
				return;
			this.counts[0]--;
			this.vanish();
		}
		rebound() {
			this.bound = new aabb([-this.expand, -this.expand], [this.expand, this.expand]);
			this.bound.translate(this.wpos);
		}
		wtorpos() {
			this.rpos = lod.project(this.wpos);
		}
		create() {
			// implement me
			console.warn(' lod: blank obj.create ');
		}
		think() {
			// implement me
		}
		vanish() {
			// implement me
			console.warn(' lod: blank obj.vanish ');
		}
	}
}

export default lod;