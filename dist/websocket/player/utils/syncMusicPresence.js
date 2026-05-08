"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMusicPresence = syncMusicPresence;
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const client_1 = __importDefault(require("../../client"));
const __1 = require("..");
const MAX_ACTIVITY_NAME = 128;
function queueIsActivelyPlaying(queue) {
    const conn = queue.connection;
    if (!conn || conn.state.status !== voice_1.VoiceConnectionStatus.Ready)
        return false;
    if (!queue.currentTrack)
        return false;
    if (queue.node.isPaused())
        return false;
    return queue.node.isPlaying() || queue.node.isBuffering();
}
/** Online + “Listening” enquanto há fila a tocar em call; invisível (parece offline) caso contrário. */
function syncMusicPresence() {
    var _a, _b;
    if (!client_1.default.user)
        return;
    try {
        const player = (0, __1.getPlayer)();
        let title;
        for (const queue of player.nodes.cache.values()) {
            if (queueIsActivelyPlaying(queue)) {
                title = (_b = (_a = queue.currentTrack) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : undefined;
                break;
            }
        }
        if (title) {
            const name = title.length > MAX_ACTIVITY_NAME
                ? `${title.slice(0, MAX_ACTIVITY_NAME - 3)}...`
                : title;
            void client_1.default.user.setPresence({
                status: discord_js_1.PresenceUpdateStatus.Online,
                activities: [{ name, type: discord_js_1.ActivityType.Listening }],
            });
        }
        else {
            void client_1.default.user.setPresence({
                status: discord_js_1.PresenceUpdateStatus.Invisible,
                activities: [],
            });
        }
    }
    catch (_c) {
        void client_1.default.user.setPresence({
            status: discord_js_1.PresenceUpdateStatus.Invisible,
            activities: [],
        });
    }
}
