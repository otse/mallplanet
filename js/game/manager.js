import pts from "../util/pts.js";
import hooks from "../util/hooks.js";
import { colormap } from "../util/colormap.js";
import { THREE } from "../mall.js";
import * as game from "./re-exports.js";
import renderer from "../renderer.js";
var manager;
(function (manager) {
    let tallies;
    (function (tallies) {
        tallies.tiles = [0, 0];
        tallies.walls = [0, 0];
    })(tallies = manager.tallies || (manager.tallies = {}));
    manager.active = false;
    const boo = 0;
    function init() {
    }
    manager.init = init;
    function start_new_game() {
        manager.active = true;
        manager.colormap_ = new colormap('colormap');
        manager.heightmap = new colormap('heightmap');
        manager.wallmap = new colormap('wallmap');
        manager.view = game.view_needs_rename.make();
        manager.ply = new game.player();
        game.projection.start();
        hook_in_to_the_lod();
    }
    manager.start_new_game = start_new_game;
    let wpos = [0, 0];
    function think() {
        if (!manager.active)
            return;
        game.projection.think();
        manager.view.think();
    }
    manager.think = think;
    function factory(type, pixel, wpos, hint) {
        let obj = new type;
        obj.wpos = wpos;
        obj.pixel = pixel;
        obj.hint = hint;
        game.lod.add(obj);
        return obj;
    }
    manager.factory = factory;
    /*export function unused_factory_when<type extends game.superobject>(type: { new(): type }, map: colormap, pos: vec2, color: vec3) {
        let pixel = wallmap.pixel(pos);
        if (pixel.is_color(color))
            factory(type, pixel, pos);
    }*/
    function hook_in_to_the_lod() {
        hooks.register('lod_chunk_create', (chunk) => {
            pts.func(chunk.small, (pos) => {
                //let pixel = somemap.pixel(pos);
                //if (pixel.is_color(game.colormap_values.some_color))
                //	factory(game.someobject, pixel, pos, 'something');
            });
            return false;
        });
        hooks.register('lod_chunk_create', (chunk) => {
            // Create walls and floors
            pts.func(chunk.small, (pos) => {
                let pixel = manager.wallmap.pixel(pos);
                if (pixel.is_color(game.colormap_values.wall_brick))
                    factory(game.wall, pixel, pos, 'brick');
                else if (pixel.is_color(game.colormap_values.tile_kitchen))
                    factory(game.floor, pixel, pos, 'kitchen');
                else if (pixel.is_color(game.colormap_values.tile_wood))
                    factory(game.floor, pixel, pos, 'wood');
            });
        });
        // Every chunk should wane and wax
        hooks.register('lod_chunk_create', (chunk) => {
            chunk.group = new THREE.Group();
            chunk.group.name = 'a chunk group';
        });
        hooks.register('lod_chunk_hide', (chunk) => {
            chunk.group.parent.remove(chunk.group);
            chunk.group.children = [];
        });
        hooks.register('lod_chunk_show', (chunk) => {
            renderer.game_objects.add(chunk.group);
        });
        function bake(chunk, hint) {
            const baked = new game.baked();
            baked.wpos = chunk.small.min;
            baked.filter = 'a floor';
            baked.hint = hint;
            game.lod.add(baked);
        }
        hooks.register('lod_chunk_show', (chunk) => {
            bake(chunk, 'kitchen');
            bake(chunk, 'wood');
        });
        return false;
    }
})(manager || (manager = {}));
export default manager;
