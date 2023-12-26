import { THREE } from "../mall.js";
import pts from "../util/pts.js";
import * as game from "./re-exports.js";
// Don't try to understand this code
// It turns a 16x, 24x, 32x, 40x, 48x, etc into a repeatable 8x
// Useful for black and white tiles
var tiler;
(function (tiler) {
    function change_uv(mesh, wpos, sheet) {
        let divide = pts.divide([game.lod.size, game.lod.size], sheet[0], sheet[1]);
        mesh.material.map.wrapS = mesh.material.map.wrapT = THREE.RepeatWrapping;
        //mesh.material.map.repeat.set(2, 2);
        mesh.material.map.needsUpdate = true;
        const attribute = mesh.geometry.getAttribute('uv');
        attribute.needsUpdate = true;
        for (let i = 0; i < attribute.array.length; i += 2) {
            const lrrl = [[0, 0], [1, 0], [1, 1], [0, 1]];
            for (let j = 0; j < 4; j++) {
                if (pts.same([attribute.array[i + 0], attribute.array[i + 1]], lrrl[j])) {
                    console.log('change uv');
                    const division = pts.divides([game.lod.size, game.lod.size], sheet);
                    let uv = pts.mults(lrrl[j], division);
                    uv = pts.add(uv, pts.mults(wpos, division));
                    attribute.array[i + 0] = uv[0];
                    attribute.array[i + 1] = uv[1];
                }
            }
        }
    }
    tiler.change_uv = change_uv;
})(tiler || (tiler = {}));
export default tiler;
