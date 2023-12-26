import { THREE } from "../mall.js";
import pts from "../util/pts.js";

import * as game from "./re-exports.js"

// It turns a 16x, 24x, 32x, 40x, 48x, etc into a repeatable 8x

namespace tiler {
	
	export function change_uv(geometry, wpos: vec2, sheet: vec2) {

		const attribute = geometry.getAttribute('uv');
		attribute.needsUpdate = true;
		for (let i = 0; i < attribute.array.length; i += 2) {
			const lrrl = [[0, 0], [1, 0], [1, 1], [0, 1]] as vec2[];
			for (let j = 0; j < 4; j++) {
				if (pts.same([attribute.array[i + 0], attribute.array[i + 1]], lrrl[j])) {
					//console.log('change uv');
					const sprite = pts.divides([game.lod.unit, game.lod.unit], sheet);
					let uv = pts.mults(lrrl[j], sprite);
					uv = pts.add(uv, pts.mults(wpos, sprite));
					// Todo: normalize the uv 0 to 1
					// It's doing [15.5, 13.5] now
					attribute.array[i + 0] = uv[0];
					attribute.array[i + 1] = uv[1];
				}
			}
		}
	}
}

export default tiler;