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
	shadow
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
			this.doOnce = false;
		}
		this.wtorpos();
		this.rebound();
		const rectangle = new game.rectangle({
			bind: this,
			alignLeftBottom: true,
			staticGeometry: true
		});
		rectangle.yup = 2;
		rectangle.build();
		{
			this.shadow = new game.superobject(game.manager.tallies.shadows);
			//this.shadow.type = 'a wall shadow';
			this.shadow.wpos = this.wpos;
			this.shadow.hint = this.hint.split('-')[0] + '-shadow';
			console.log('wall shadow hint:', this.shadow.hint);
			game.lod.add(this.shadow);
			const rectangle = new game.rectangle({
				bind: this.shadow,
				alignLeftBottom: true,
				staticGeometry: true
			});
			rectangle.yup = 1;
			rectangle.build();
		}
	}
	override vanish() {
		this.rectangle?.destroy();
		this.shadow.rectangle?.destroy();
	}
	override think() {
		// Whatever would a wall think?
	}
}

export default wall;