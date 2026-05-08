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
exports.onDisconnect = void 0;
const localization_1 = require("../../../utils/localization");
const config_1 = require("../../../config");
const socket_1 = require("../../socket");
const discord_js_1 = require("discord.js");
const syncMusicPresence_1 = require("../utils/syncMusicPresence");
const onDisconnect = (queue) => __awaiter(void 0, void 0, void 0, function* () {
    const data = queue.metadata;
    const { channelId, locale } = data;
    const ws = socket_1.sockets.get(data.wsId);
    if (!ws)
        return;
    ws.send(JSON.stringify({
        event: 'client_disconnected',
        guildId: queue.guild.id,
        channelId: data.channelId,
        playingChannel: data.channel.id,
    }));
    const guild = queue.guild;
    const channel = guild.channels.resolve(channelId);
    if (!channel || !channel.isTextBased())
        return;
    const container = new discord_js_1.ContainerBuilder()
        .setAccentColor(parseInt(config_1.colors.default_color, 16))
        .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`### ${(0, localization_1.t)('player.events.client_disconnect.title', locale)}\n${(0, localization_1.t)('player.events.client_disconnect.description', locale)}`));
    yield channel.send({
        components: [container],
        flags: discord_js_1.MessageFlags.IsComponentsV2,
    });
    (0, syncMusicPresence_1.syncMusicPresence)();
});
exports.onDisconnect = onDisconnect;
