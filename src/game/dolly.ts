/// the name is misleading, this is actually an internal camera marker

import { THREE } from "../mall.js";
import renderer from "../renderer.js";
import lod, { numbers } from "./lod.js";

export class dolly extends lod.obj {
	line
	helper
	constructor(wpos: vec2) {
		let before
		super(numbers.objs);
		this.wpos = wpos;
	}
	override create() {
		console.log(' lod create dolly marker ');

		const material = new THREE.LineBasicMaterial({
			color: 'green'
		});
		const points: any[] = [];
		points.push(new THREE.Vector3(0, 0, 0));
		points.push(new THREE.Vector3(0, 50, 0));
		const geometry = new THREE.BufferGeometry().setFromPoints(points);

		this.line = new THREE.Line(geometry, material);
		this.line.position.set(this.wpos[0], 0, this.wpos[1]);
		//this.line.rotation.set(Math.PI / 4, 0, Math.PI / 6);
		this.line.updateMatrix();

		this.helper = new THREE.AxesHelper(4);
		this.helper.updateMatrix();

		renderer.camera.rotation.x = -Math.PI / 2;
		
		renderer.camera.position.set(0, 30, 0);
		renderer.camera.updateMatrix();
		renderer.camera.updateProjectionMatrix();
		
		//this.line.add(renderer.camera);

		renderer.game_objects.add(this.line);
		renderer.game_objects.add(this.helper);
	}
	override vanish() {
		console.log(' vanish dolly ');

		renderer.game_objects.remove(this.helper);
	}
	override tick() {
		this.line.updateMatrix();
		this.helper.updateMatrix();
		// whatever would a terrain tile think?
	}

}

export default dolly;