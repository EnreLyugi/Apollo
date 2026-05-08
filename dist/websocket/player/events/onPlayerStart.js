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
exports.onPlayerStart = void 0;
const classes_1 = require("../classes");
const syncMusicPresence_1 = require("../utils/syncMusicPresence");
const onPlayerStart = (queue, track) => __awaiter(void 0, void 0, void 0, function* () {
    const data = queue.metadata;
    const { channelId, locale } = data;
    const guild = queue.guild;
    const channel = guild.channels.resolve(channelId);
    if (!channel || !channel.isTextBased())
        return;
    const pm = new classes_1.PlayerMessage(track, locale);
    yield pm.send(channel);
    data.currentMessage = pm.message;
    data.playerMessage = pm;
    data.track = track;
    queue.metadata = data;
    pm.startAutoUpdate(queue, track.url);
    (0, syncMusicPresence_1.syncMusicPresence)();
});
exports.onPlayerStart = onPlayerStart;
