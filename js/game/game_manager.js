/// holds things like the player object
import player from "./player.js";
import terrain from "./terrain.js";
import view_needs_rename from "./view_needs_rename.js";
import { colormap } from "./colormap.js";
import projection from "./projection.js";
var game_manager;
(function (game_manager) {
    game_manager.active = false;
    const boo = 0;
    function init() {
    }
    game_manager.init = init;
    function start_new_game() {
        game_manager.active = true;
        game_manager.gcolormap = new colormap('colormap');
        game_manager.gheightmap = new colormap('heightmap');
        game_manager.gview = view_needs_rename.make();
        game_manager.gplayer = new player();
        projection.start();
        terrain.simple_populate();
    }
    game_manager.start_new_game = start_new_game;
    let wpos = [0, 0];
    function think() {
        if (!game_manager.active)
            return;
        game_manager.gview.think();
        projection.loop();
    }
    game_manager.think = think;
})(game_manager || (game_manager = {}));
export default game_manager;
