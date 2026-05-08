"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previousPageButton = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
exports.previousPageButton = new discord_js_1.ButtonBuilder()
    .setCustomId('previousPageButton')
    .setEmoji(config_1.emojis.previousPage)
    .setStyle(discord_js_1.ButtonStyle.Primary);
