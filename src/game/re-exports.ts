/// Rocket science

import lod from "./lod.js";
import sprites from "./sprites.js";
import superobject from "./objects/superobject.js";
import manager from "./manager.js";
import colormap_values from "./colormap_values.js";
import player from "./objects/player.js";
import car from "./objects/car.js";
import projection from "./projection.js";
import view_needs_rename from "./view_needs_rename.js";
import floor from "./objects/floor.js";
import wall from "./objects/wall.js";
import tiler from "./tiler.js";
import rectangle from "./objects/rectangle.js";
import baked from "./objects/baked.js";

type foo = number

export { lod, manager, superobject, baked, sprites, rectangle, colormap_values, tiler, player, car, projection, view_needs_rename, floor, wall }

// Usage:
// import * as game from "./re-exports.js"