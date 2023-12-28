import { THREE } from "../../mall.js";
import renderer from "../../renderer.js";
import pts from "../../util/pts.js";

import * as game from "../re-exports.js"


export class wall extends game.superobject {
	override type = 'a wall'
	override solid = true
	geometry
	material
	mesh
	doOnce = true
	shadow: wall_shadow
	box: wall_box
	constructor() {
		super(game.manager.tallies.walls);
	}
	override create() {
		if (!this.pixel)
			return;
		if (this.doOnce) {
			if (this.pixel.connections() >= 3) {
				this.hint += ' -single';
			}
			else if (
				this.pixel.top().is_color(this.pixel.data) &&
				this.pixel.bottom().is_color(this.pixel.data)) {
				this.hint += ' -vert';
			}
			else if (
				this.pixel.left().is_color(this.pixel.data) &&
				this.pixel.right().is_color(this.pixel.data)) {
				this.hint += ' -horz';
			}
			else {
				this.hint += ' -single';
			}
			this.shadow = new wall_shadow(this);
			game.lod.add(this.shadow);
			this.box = new wall_box(this);
			game.lod.add(this.box);
			this.doOnce = false;
		}
		this.wtorpos();
		this.rebound();
		const rectangle = new game.rectangle({
			bind: this,
			alignLeftBottom: true,
			staticGeometry: true
		});
		rectangle.yup = 3.1;
		rectangle.build();
	}
	override vanish() {
		this.rectangle?.destroy();
		this.rectangle = undefined;
	} 
	override think() {
		// Whatever would a wall think?
	}
}

export class wall_box extends game.superobject {
	constructor(readonly base: wall) {
		super(game.manager.tallies.shadows);
		this.hint = base.hint.split('-')[0] + '-box';
		this.wpos = base.wpos;
	}
	override create() {
		const rectangle = new game.rectangle({
			bind: this,
			alignLeftBottom: true,
			staticGeometry: true
		});
		rectangle.yup = 0;
		rectangle.build();
	}
	override vanish() {
		this.rectangle?.destroy();
		this.rectangle = undefined;
	}
}

export class wall_shadow extends game.superobject {
	constructor(readonly base: wall) {
		super(game.manager.tallies.shadows);
		this.hint = base.hint.split('-')[0] + '-shadow';
		this.wpos = base.wpos;
	}
	override create() {
		const rectangle = new game.rectangle({
			bind: this,
			alignLeftBottom: true,
			staticGeometry: true
		});
		rectangle.yup = 0.1;
		rectangle.build();
	}
	override vanish() {
		this.rectangle?.destroy();
		this.rectangle = undefined;
	}
}


export default wall;