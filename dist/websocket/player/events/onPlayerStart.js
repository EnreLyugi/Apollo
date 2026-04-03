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
exports.onPlayerStart = void 0;
const localization_1 = require("../../../utils/localization");
const embed_1 = __importDefault(require("../../../models/embed"));
const utils_1 = require("./utils");
const components_1 = require("../components");
const onPlayerStart = (queue, track) => __awaiter(void 0, void 0, void 0, function* () {
    const data = queue.metadata;
    const { channelId, locale } = data;
    const guild = queue.guild;
    const channel = guild.channels.resolve(channelId);
    if (!channel)
        return;
    if (!channel.isTextBased())
        return;
    const response = new embed_1.default()
        .setColor("#00FF00")
        .setAuthor({ name: (0, localization_1.t)('player.states.playing_now', locale) })
        .setThumbnail({ url: track.thumbnail })
        .setDescription(`[${track.title}](${track.url})\n${(0, localization_1.t)('misc.duration', locale)} ${"`" + track.duration + "`"}\n\n${(0, localization_1.t)('player.misc.requested_by', locale)}: ${track.requestedBy}`)
        .addField(`\u200b`, `[${(0, localization_1.t)('player.misc.invite_me', locale)}](https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=1099821344854&scope=bot)`);
    const responseMessage = yield channel.send({
        embeds: [response.build()],
        components: [components_1.unpausedButtons],
    });
    track.currentMessage = responseMessage;
    data.currentMessage = responseMessage;
    data.track = track;
    queue.metadata = data;
    setTimeout(function () {
        (0, utils_1.updateEmbed)(queue, track);
    }, 2000);
});
exports.onPlayerStart = onPlayerStart;
