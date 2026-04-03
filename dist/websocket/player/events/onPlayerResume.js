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
exports.onPlayerResume = void 0;
const localization_1 = require("../../../utils/localization");
const components_1 = require("../components");
const discord_js_1 = require("discord.js");
const onPlayerResume = (queue) => __awaiter(void 0, void 0, void 0, function* () {
    const data = queue.metadata;
    const { locale } = data;
    const track = queue.currentTrack;
    if (!track)
        return;
    const oldEmbed = data.currentMessage.embeds[0];
    const embed = discord_js_1.EmbedBuilder.from(oldEmbed)
        .setColor("#00FF00")
        .setAuthor({ name: (0, localization_1.t)('player.states.playing_now', locale) });
    const message = yield data.currentMessage.edit({
        embeds: [embed],
        components: [components_1.unpausedButtons],
    });
    data.currentMessage = message;
});
exports.onPlayerResume = onPlayerResume;
