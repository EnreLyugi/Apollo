"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpausedButtons = exports.pausedButtons = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../../../config");
exports.pausedButtons = new discord_js_1.ActionRowBuilder()
    .addComponents(new discord_js_1.ButtonBuilder()
    .setCustomId('unpauseButton')
    .setEmoji(config_1.emojis.play)
    .setStyle(discord_js_1.ButtonStyle.Danger));
exports.unpausedButtons = new discord_js_1.ActionRowBuilder()
    .addComponents(new discord_js_1.ButtonBuilder()
    .setCustomId('rewindButton')
    .setEmoji(config_1.emojis.rewind)
    .setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder()
    .setCustomId('pauseButton')
    .setEmoji(config_1.emojis.pause)
    .setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder()
    .setCustomId('skipButton')
    .setEmoji(config_1.emojis.skip)
    .setStyle(discord_js_1.ButtonStyle.Success));
