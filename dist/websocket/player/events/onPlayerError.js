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
exports.onPlayerError = void 0;
const localization_1 = require("../../../utils/localization");
const discord_js_1 = require("discord.js");
const syncMusicPresence_1 = require("../utils/syncMusicPresence");
const onPlayerError = (queue, error) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
    const errCode = (_b = (_a = error === null || error === void 0 ? void 0 : error.code) !== null && _a !== void 0 ? _a : error === null || error === void 0 ? void 0 : error.name) !== null && _b !== void 0 ? _b : '';
    const msgKey = errCode === 'ERR_NO_RESULT'
        ? 'player.errors.no_results'
        : 'misc.error_ocurred';
    const container = new discord_js_1.ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`### ${(0, localization_1.t)('misc.error_ocurred', locale)}\n${(0, localization_1.t)(msgKey, locale)}`));
    yield channel.send({
        components: [container],
        flags: discord_js_1.MessageFlags.IsComponentsV2,
    }).catch(() => { });
    (0, syncMusicPresence_1.syncMusicPresence)();
});
exports.onPlayerError = onPlayerError;
