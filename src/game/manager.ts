/// holds things like the player object

import player from "./player.js";

namespace manager {

    const boo = 0

    export var gplayer: player

    export function init() {
        gplayer = new player();
    }

    export function start_new_game() {
        
    }
}

export default manager;