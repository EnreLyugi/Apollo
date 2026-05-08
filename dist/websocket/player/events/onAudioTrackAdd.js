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
exports.onAudioTrackAdd = void 0;
const socket_1 = require("../../socket");
const onAudioTrackAdd = (queue, track) => __awaiter(void 0, void 0, void 0, function* () {
    if (!('wsId' in track.requestedBy) || !('interactionId' in track.requestedBy))
        return;
    const ws = socket_1.sockets.get(track.requestedBy.wsId);
    if (!ws)
        return;
    const message = {
        event: 'song_added',
        interactionId: track.requestedBy.interactionId,
        name: track.cleanTitle,
        url: track.url,
        duration: track.duration,
        thumbnail: track.thumbnail
    };
    ws.send(JSON.stringify(message));
    return;
});
exports.onAudioTrackAdd = onAudioTrackAdd;
