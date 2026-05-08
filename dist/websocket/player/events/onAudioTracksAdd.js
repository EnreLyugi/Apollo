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
exports.onAudioTracksAdd = void 0;
const socket_1 = require("../../socket");
const onAudioTracksAdd = (queue, tracks) => __awaiter(void 0, void 0, void 0, function* () {
    const { wsId, interactionId } = tracks[0].requestedBy;
    const ws = socket_1.sockets.get(wsId);
    if (!ws)
        return;
    const playlist = tracks[0].playlist;
    const message = {
        event: 'playlist_added',
        interactionId: interactionId,
        name: playlist.title,
        url: playlist.url,
        thumbnail: playlist.thumbnail,
        length: tracks.length
    };
    ws.send(JSON.stringify(message));
    return;
});
exports.onAudioTracksAdd = onAudioTracksAdd;
