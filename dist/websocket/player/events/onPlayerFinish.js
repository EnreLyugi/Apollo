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
exports.onPlayerFinish = void 0;
const localization_1 = require("../../../utils/localization");
const discord_js_1 = require("discord.js");
const onPlayerFinish = (queue, track) => __awaiter(void 0, void 0, void 0, function* () {
    const data = queue.metadata;
    const { locale } = data;
    const oldEmbed = data.currentMessage.embeds[0];
    const embed = discord_js_1.EmbedBuilder.from(oldEmbed)
        .setColor("#FF0000")
        .setAuthor({ name: (0, localization_1.t)('player.states.song_finished', locale) })
        .setDescription(`[${track.title}](${track.url})\n\n${(0, localization_1.t)('player.misc.requested_by', locale)} ${track.requestedBy}`);
    const message = yield data.currentMessage.edit({
        embeds: [embed],
        components: [],
    });
    data.currentMessage = message;
});
exports.onPlayerFinish = onPlayerFinish;
