import pts from "../util/pts.js";

import { THREE } from "../mall.js";

export namespace sprites {

	export type tuple = [totalSize: vec2, singleSize: vec2, padding: number, path: string]

	export const placeholder_8x: tuple = [[8, 8], [8, 8], 0, './tex/placeholder_8x.png']
	export const wall_brick_single_8x: tuple = [[8, 8], [8, 8], 0, './tex/sprWall.png']
	export const wall_brick_vert_8x: tuple = [[8, 32], [8, 8], 0, './tex/sprWallV.png']
	export const wall_brick_horz_8x: tuple = [[32, 8], [8, 8], 0, './tex/sprWallH.png']
	export const wall_brick_shadow_8x: tuple = [[8, 8], [8, 8], 0, './tex/wall_brick_single_8x_shadow.png']
	export const wall_brick_under_8x: tuple = [[8, 8], [8, 8], 0, './tex/wall_brick_under_8x.png']
	export const floor_kitchen: tuple = [[16, 16], [8, 8], 0, './tex/kitchen_floor_16x.png']
	export const floor_wooden: tuple = [[32, 32], [8, 8], 0, './tex/wood_floor_32x.png']
	export const player: tuple = [[32, 32], [32, 32], 0, './tex/player_32x.png']
	export const jacket: tuple = [[48, 48], [48, 48], 0, './tex/jacket_pistol.png']
	export const sprJacketCar: tuple = [[1404, 70], [108, 70], 0, './tex/sprJacketCar.png']

	export function get_uv_transform(cell: vec2, tuple: tuple) {
		let singles_fit = pts.divides(tuple[1], tuple[0]);
		let offset = pts.mults(singles_fit, cell);
        // do .5 pixel offset
        //offset = pts.subtract(offset, pts.divide(pts.divides([1, 1], tuple[0]), 0.05));
		let repeat = singles_fit;
		let center = [0, 1];
		let mat = new THREE.Matrix3;
		mat.setUvTransform(offset[0], offset[1], repeat[0], repeat[1], 0, center[0], center[1]);
		return mat;
	};
};

export default sprites;