import pts from "../util/pts.js";
import { THREE } from "../mall.js";
export var sprites;
(function (sprites) {
    sprites.placeholder_8x = [[8, 8], [8, 8], 0, './tex/placeholder_8x.png'];
    sprites.wall_brick_single_8x = [[8, 8], [8, 8], 0, './tex/sprWall.png'];
    sprites.wall_brick_vert_8x = [[8, 32], [8, 8], 0, './tex/sprWallV.png'];
    sprites.wall_brick_horz_8x = [[32, 8], [8, 8], 0, './tex/sprWallH.png'];
    sprites.wall_brick_shadow_8x = [[8, 8], [8, 8], 0, './tex/wall_brick_single_8x_shadow.png'];
    sprites.wall_brick_under_8x = [[8, 8], [8, 8], 0, './tex/wall_brick_under_8x.png'];
    sprites.floor_kitchen = [[16, 16], [8, 8], 0, './tex/kitchen_floor_16x.png'];
    sprites.floor_wooden = [[32, 32], [8, 8], 0, './tex/wood_floor_32x.png'];
    sprites.player = [[32, 32], [32, 32], 0, './tex/player_32x.png'];
    sprites.jacket = [[48, 48], [48, 48], 0, './tex/jacket_pistol.png'];
    sprites.sprJacketCar = [[1404, 70], [108, 70], 0, './tex/sprJacketCar.png'];
    function get_uv_transform(cell, tuple) {
        let singles_fit = pts.divides(tuple[1], tuple[0]);
        let offset = pts.mults(singles_fit, cell);
        // do .5 pixel offset
        //offset = pts.subtract(offset, pts.divide(pts.divides([1, 1], tuple[0]), 0.05));
        let repeat = singles_fit;
        let center = [0, 1];
        let mat = new THREE.Matrix3;
        mat.setUvTransform(offset[0], offset[1], repeat[0], repeat[1], 0, center[0], center[1]);
        return mat;
    }
    sprites.get_uv_transform = get_uv_transform;
    ;
})(sprites || (sprites = {}));
;
export default sprites;
