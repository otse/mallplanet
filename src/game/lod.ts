import hooks from "../util/hooks.js"
import pts2 from "../util/pts2.js"
import aabb2 from "../util/aabb2.js"
import renderer from "../renderer.js"
import { THREE } from "../mall.js"

export namespace numbers {
	export type tally = [active: number, total: number]

	export var sectors: tally = [0, 0]
	export var sprites: tally = [0, 0]
	export var objs: tally = [0, 0]

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

	export const size = 1;

	const chunk_coloration = true;

	const fog_of_war = false;

	const grid_crawl_makes_sectors = true;

	export var gworld: world;
	export var ggrid: grid;

	export var SectorSpan = 4;

	export var stamp = 0; // used only by server slod

	export function register() {
		// hooks.create('sectorCreate')
		// hooks.create('sectorShow')
		// hooks.create('sectorHide')

		// hooks.register('sectorHide', () => { console.log('~'); return false; } );
	}

	export function project(unit: vec2): vec2 {
		return pts2.mult(pts2.project(unit), lod.size);
	}

	export function unproject(pixel: vec2): vec2 {
		return pts2.divide(pts2.unproject(pixel), lod.size);
	}

	export function add(obj: obj) {
		let sector = gworld.at(lod.world.big(obj.wpos));
		sector.add(obj);
	}

	export function remove(obj: obj) {
		obj.sector?.remove(obj);
	}

	export class world {
		readonly arrays: sector[][] = []
		constructor(span) {
			gworld = this;
			new grid(4, 4);
		}
		update(wpos: vec2) {
			
			ggrid.big = lod.world.big(wpos);
			console.log('big', ggrid.big);
			ggrid.ons();
			ggrid.offs();
		}
		lookup(big: vec2): sector | undefined {
			if (this.arrays[big[1]] == undefined)
				this.arrays[big[1]] = [];
			return this.arrays[big[1]][big[0]];
		}
		at(big: vec2): sector {
			return this.lookup(big) || this.make(big);
		}
		protected make(big): sector {
			let s = this.lookup(big);
			if (s)
				return s;
			s = this.arrays[big[1]][big[0]] = new sector(big, this);
			return s;
		}
		static big(units: vec2): vec2 {
			return pts2.floor(pts2.divide(units, SectorSpan));
		}
	}

	export class sector extends toggle {
		group
		color = 'white'
		fog_of_war = false
		readonly small: aabb2;
		readonly objs: obj[] = [];
		constructor(
			public readonly big: vec2,
			readonly world: world
		) {
			super();
			if (chunk_coloration)
				this.color = (['lightsalmon', 'lightblue', 'beige', 'pink'])[Math.floor(Math.random() * 4)];
			let min = pts2.mult(this.big, SectorSpan);
			let max = pts2.add(min, [SectorSpan - 1, SectorSpan - 1]);
			this.small = new aabb2(max, min);
			this.group = new THREE.Group();
			this.group.frustumCulled = false;
			this.group.matrixAutoUpdate = false;
			numbers.sectors[1]++;
			world.arrays[this.big[1]][this.big[0]] = this;
			//console.log('sector');

			hooks.call('sectorCreate', this);

		}
		add(obj: obj) {
			let i = this.objs.indexOf(obj);
			if (i == -1) {
				this.objs.push(obj);
				obj.sector = this;
				if (this.is_active() && !obj.is_active())
					obj.show();
			}
		}
		stacked(wpos: vec2) {
			let stack: obj[] = [];
			for (let obj of this.objs)
				if (pts2.equals(wpos, pts2.round(obj.wpos)))
					stack.push(obj);
			return stack;
		}
		remove(obj: obj): boolean | undefined {
			let i = this.objs.indexOf(obj);
			if (i > -1) {
				obj.sector = null;
				return !!this.objs.splice(i, 1).length;
			}
		}
		static swap(obj: obj) {
			// Call me whenever you move
			let oldSector = obj.sector!;
			let newSector = oldSector.world.at(lod.world.big(pts2.round(obj.wpos)));
			if (oldSector != newSector) {
				oldSector.remove(obj);
				newSector.add(obj);
				if (!newSector.is_active())
					obj.hide();
			}
		}
		tick() {
			hooks.call('sectorTick', this);
			//for (let obj of this.objs)
			//	obj.tick();
		}
		show() {
			if (this.on())
				return;
			numbers.sectors[0]++;
			for (let obj of this.objs)
				obj.show();
			renderer.scene.add(this.group);
			hooks.call('sectorShow', this);
		}
		hide() {
			if (this.off())
				return;
			numbers.sectors[0]--;
			for (let obj of this.objs)
				obj.hide();
			renderer.scene.remove(this.group);
			hooks.call('sectorHide', this);
		}
		dist() {
			return pts2.distsimple(this.big, lod.ggrid.big);
		}
		grayscale() {
			this.color = 'gray';
		}
	}

	export class grid {
		big: vec2 = [0, 0];
		public shown: sector[] = [];
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
		visible(sector: sector) {
			return sector.dist() < this.spread;
		}
		ons() {
			// spread = -2; < 2
			for (let y = -this.spread; y < this.spread + 1; y++) {
				for (let x = -this.spread; x < this.spread + 1; x++) {
					let pos = pts2.add(this.big, [x, y]);
					let sector = grid_crawl_makes_sectors ? gworld.at(pos) : gworld.lookup(pos);
					if (!sector)
						continue;
					if (!sector.is_active()) {
						this.shown.push(sector);
						sector.show();
						for (let obj of sector.objs)
							obj.tick();
					}
				}
			}
		}
		offs() {
			// Hide sectors
			this.visibleObjs = [];
			let i = this.shown.length;
			while (i--) {
				let sector: sector;
				sector = this.shown[i];
				if (sector.dist() > this.outside) {
					sector.hide();
					this.shown.splice(i, 1);
				}
				else {
					sector.tick();
					this.visibleObjs = this.visibleObjs.concat(sector.objs);
				}

				if (fog_of_war) {
					if (sector.dist() == this.outside) {
						//console.log('brim-chunk');
						sector.fog_of_war = true;
						//sector.color = '#555555';
					}
					else {
						sector.fog_of_war = false;
						//sector.color = '#ffffff';
					}
				}
			}
		}
		ticks() {
			for (let sector of this.shown)
				for (let obj of sector.objs)
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
		sector: sector | null
		ro = 0
		z = 0
		calcz = 0
		height = 0
		bound: aabb2
		expand = .5
		constructor(
			public readonly counts: numbers.tally = numbers.objs) {
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
			this.bound = new aabb2([-this.expand, -this.expand], [this.expand, this.expand]);
			this.bound.translate(this.wpos);
		}
		wtorpos() {
		}
		rtospos() {
			this.wtorpos();
			return pts2.clone(this.rpos);
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