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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.play = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../../utils/localization");
const client_1 = __importDefault(require("../../client"));
const player_1 = require("../../player");
const socket_1 = require("../../socket");
const play = (data, wsId) => __awaiter(void 0, void 0, void 0, function* () {
    const { guildId, channelId, userId, music, interactionId, interactionChannelId } = data;
    const guild = client_1.default.guilds.cache.get(guildId);
    if (!guild)
        return;
    const locale = (0, localization_1.mapLocale)(guild.preferredLocale);
    const channel = guild.channels.resolve(channelId);
    if (!channel)
        return;
    if (!(channel instanceof discord_js_1.VoiceChannel))
        return;
    const user = client_1.default.users.cache.get(userId);
    if (!user)
        return;
    user.wsId = wsId;
    user.interactionId = interactionId;
    try {
        const player = (0, player_1.getPlayer)();
        yield player.play(channel, music, {
            requestedBy: user,
            nodeOptions: {
                leaveOnEmpty: false,
                leaveOnEnd: false,
                leaveOnStop: false,
                metadata: {
                    channel: channel,
                    requestedBy: user,
                    interactionId,
                    channelId: interactionChannelId,
                    locale,
                    wsId
                }
            }
        });
    }
    catch (e) {
        const ws = socket_1.sockets.get(wsId);
        if (!ws)
            return;
        const message = {
            event: 'play_error',
            interactionId,
            e
        };
        ws.send(JSON.stringify(message));
    }
});
exports.play = play;
