"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
const discord_player_1 = require("discord-player");
const player_1 = require("../../player");
const socket_1 = require("../../socket");
const modeToRepeat = {
    off: discord_player_1.QueueRepeatMode.OFF,
    track: discord_player_1.QueueRepeatMode.TRACK,
    queue: discord_player_1.QueueRepeatMode.QUEUE,
};
const loop = (data, wsId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { guildId, interactionId, mode } = data;
    try {
        const player = (0, player_1.getPlayer)();
        const queue = player.nodes.get(guildId);
        if (!queue) {
            const ws = socket_1.sockets.get(wsId);
            if (!ws)
                return;
            ws.send(JSON.stringify({ event: "loop_error", interactionId, error: "NO_QUEUE" }));
            return;
        }
        const repeatMode = (_a = modeToRepeat[mode]) !== null && _a !== void 0 ? _a : discord_player_1.QueueRepeatMode.OFF;
        queue.setRepeatMode(repeatMode);
        const ws = socket_1.sockets.get(wsId);
        if (!ws)
            return;
        ws.send(JSON.stringify({ event: "loop_success", interactionId, mode }));
    }
    catch (e) {
        const ws = socket_1.sockets.get(wsId);
        if (!ws)
            return;
        ws.send(JSON.stringify({ event: "loop_error", interactionId, error: String(e) }));
    }
});
exports.loop = loop;
