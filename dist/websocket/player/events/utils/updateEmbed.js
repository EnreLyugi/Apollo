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
exports.HandleError = exports.updateEmbed = void 0;
const localization_1 = require("../../../../utils/localization");
const config_1 = require("../../../../config");
const components_1 = require("../../components");
const discord_js_1 = require("discord.js");
const updateEmbed = function (queue, track) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = queue.metadata;
        const { locale } = data;
        const update = setInterval(function () {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const progressBar = queue.node.createProgressBar({
                        length: config_1.progressBarOptions.size
                    });
                    /* ProgressBarOptions
                        indicator	string
                        leftChar	string
                        length	number
                        queue	boolean
                        rightChar	string
                        separator	string
                        timecodes	boolean
                    */
                    const oldEmbed = data.currentMessage.embeds[0];
                    const embed = discord_js_1.EmbedBuilder.from(oldEmbed)
                        .setDescription(`[${track.title}](${track.url})\n${progressBar}\n\n\n${(0, localization_1.t)('player.misc.requested_by', locale)}: ${track.requestedBy}`);
                    const message = yield data.currentMessage.edit({
                        embeds: [embed],
                        components: [queue.node.isPaused() ? components_1.pausedButtons : components_1.unpausedButtons],
                    }).catch((e) => {
                        console.error(e);
                    });
                    data.currentMessage = message;
                    if (queue.currentTrack.url != data.track.url || (!queue.node.isPlaying() && !queue.node.isPaused)) {
                        (0, exports.HandleError)(track, update, locale, data);
                    }
                }
                catch (e) {
                    (0, exports.HandleError)(track, update, locale, data);
                }
            });
        }, 2000);
    });
};
exports.updateEmbed = updateEmbed;
const HandleError = function (track, update, localization, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const locale = (0, localization_1.mapLocale)(localization !== null && localization !== void 0 ? localization : '');
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
        if (update) {
            clearInterval(update);
        }
    });
};
exports.HandleError = HandleError;
