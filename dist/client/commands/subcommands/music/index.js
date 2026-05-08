"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcommands = void 0;
const play_1 = require("./play");
const skip_1 = require("./skip");
const stop_1 = require("./stop");
const loop_1 = require("./loop");
const shuffle_1 = require("./shuffle");
exports.subcommands = [play_1.play, skip_1.skip, stop_1.stop, loop_1.loop, shuffle_1.shuffle];
