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
exports.onPlayerSkip = void 0;
const localization_1 = require("../../../utils/localization");
const discord_js_1 = require("discord.js");
const onPlayerSkip = (queue, track) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = queue.metadata;
    if (!data)
        return;
    if (data.playerMessage) {
        yield data.playerMessage.setState('finished');
    }
    const { channelId, locale } = data;
    const guild = queue.guild;
    const channel = guild.channels.resolve(channelId);
    if (!channel || !channel.isTextBased())
        return;
    const container = new discord_js_1.ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`### ${(0, localization_1.t)('player.errors.no_results', locale)}\n${(_a = track === null || track === void 0 ? void 0 : track.title) !== null && _a !== void 0 ? _a : ''}`));
    yield channel.send({
        components: [container],
        flags: discord_js_1.MessageFlags.IsComponentsV2,
    }).catch(() => { });
});
exports.onPlayerSkip = onPlayerSkip;
