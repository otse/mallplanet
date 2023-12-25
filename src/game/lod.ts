import hooks from "../util/hooks.js"
import pts from "../util/pts.js"
import aabb from "../util/aabb.js"

export namespace objs {
	export type tally = [active: number, total: number]

	// export var objs: tally = [0, 0]
	export var chunks: tally = [0, 0]

	export var tiles: tally = [0, 0]
	export var walls: tally = [0, 0]
};

class toggle {
	protected active = false;
	is_active() { return this.active };
	on() {
		if (this.active) {
			return true;
		}
		this.active = true;
		return false;
	}
	off() {
		if (!this.active) {
			return true;
		}
		this.active = false;
		return false;
	}
}

namespace lod {

	export const numbers = objs

	export const size = 1

	const chunk_coloration = false

	const fog_of_war = false

	const grid_crawl_makes_chunks = true

	export const chunk_span = 4

	// Yep like singletons
	export var gworld: world
	export var ggrid: grid

	export function register() {
	}

	export function project(unit: vec2): vec2 {
		return pts.mult(pts.project(unit), lod.size);
	}

	export function unproject(pixel: vec2): vec2 {
		return pts.divide(pts.unproject(pixel), 1.1);
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
		constructor(span) {
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
			objs.chunks[1]++;
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
				if (this.is_active() && !obj.is_active())
					obj.show();
			}
		}
		stacked(wpos: vec2) {
			let stack: obj[] = [];
			for (let obj of this.objs)
				if (pts.equals(wpos, pts.round(obj.wpos)))
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
				if (!newChunk.is_active())
					obj.hide();
			}
		}
		tick() {
			hooks.call('lod_chunk_think', this);
			//for (let obj of this.objs)
			//	obj.tick();
		}
		show() {
			if (this.on())
				return;
			objs.chunks[0]++;
			for (let obj of this.objs)
				obj.show();
			hooks.call('lod_chunk_show', this);
		}
		hide() {
			if (this.off())
				return;
			objs.chunks[0]--;
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
		big: vec2 = [0, 0];
		public shown: chunk[] = [];
		visibleObjs: obj[] = []
		constructor(
			public spread: number,
			public outside: number
		) {
			lod.ggrid = this;
			if (this.outside < this.spread) {
				console.warn(' outside less than spread ', this.spread, this.outside);
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
					if (!chunk.is_active()) {
						this.shown.push(chunk);
						chunk.show();
						for (let obj of chunk.objs)
							obj.tick();
						// todo why do we tick here
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
					chunk.tick();
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
		ticks() {
			for (let chunk of this.shown)
				for (let obj of chunk.objs)
					obj.tick();
		}
	}

	interface ObjHints {

	};

	export class obj extends toggle {
		id = -1
		type = 'an obj'
		networked = false
		solid = false
		wpos: vec2 = [0, 0]
		rpos: vec2 = [0, 0]
		size: vec2 = [100, 100]
		chunk: chunk | null
		ro = 0
		z = 0
		calcz = 0
		height = 0
		bound: aabb
		expand = .5
		constructor(
			public readonly counts: objs.tally = [0, 0]) {
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
			//this.shape?.show();
		}
		hide() {
			if (this.off())
				return;
			this.counts[0]--;
			this.vanish();
			//this.delete();
			//this.shape?.hide();
			// console.log(' obj.hide ');
		}
		rebound() {
			this.bound = new aabb([-this.expand, -this.expand], [this.expand, this.expand]);
			this.bound.translate(this.wpos);
		}
		wtorpos() {
		}
		rtospos() {
			this.wtorpos();
			return pts.clone(this.rpos);
		}
		tick() {
			// implement me
		}
		create() {
			// implement me
			console.warn(' (lod) obj.create ');
		}
		vanish() {
			// implement me
			console.warn(' (lod) obj.vanish ');
		}
	}
}

export default lod;