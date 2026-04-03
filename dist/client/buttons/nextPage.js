"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextPageButton = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
exports.nextPageButton = new discord_js_1.ButtonBuilder()
    .setCustomId('nextPageButton')
    .setEmoji(config_1.emojis.nextPage)
    .setStyle(discord_js_1.ButtonStyle.Primary);
