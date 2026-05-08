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
exports.stop = void 0;
const player_1 = require("../../player");
const syncMusicPresence_1 = require("../../player/utils/syncMusicPresence");
const socket_1 = require("../../socket");
const stop = (data, wsId) => __awaiter(void 0, void 0, void 0, function* () {
    const { guildId, interactionId } = data;
    try {
        const player = (0, player_1.getPlayer)();
        const queue = player.nodes.get(guildId);
        if (!queue) {
            const ws = socket_1.sockets.get(wsId);
            if (!ws)
                return;
            ws.send(JSON.stringify({ event: 'stop_error', interactionId, error: 'NO_QUEUE' }));
            return;
        }
        const metadata = queue.metadata;
        if (metadata === null || metadata === void 0 ? void 0 : metadata.playerMessage) {
            yield metadata.playerMessage.setState('finished');
        }
        queue.delete();
        (0, syncMusicPresence_1.syncMusicPresence)();
        const ws = socket_1.sockets.get(wsId);
        if (!ws)
            return;
        ws.send(JSON.stringify({ event: 'stop_success', interactionId }));
    }
    catch (e) {
        const ws = socket_1.sockets.get(wsId);
        if (!ws)
            return;
        ws.send(JSON.stringify({ event: 'stop_error', interactionId, error: e }));
    }
});
exports.stop = stop;
