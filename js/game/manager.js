/// holds things like the player object
import player from "./player.js";
var manager;
(function (manager) {
    const boo = 0;
    function init() {
        manager.gplayer = new player();
    }
    manager.init = init;
    function start_new_game() {
    }
    manager.start_new_game = start_new_game;
})(manager || (manager = {}));
export default manager;
