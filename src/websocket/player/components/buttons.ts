import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { emojis } from "../../../config";

export const pausedButtons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('unpauseButton')
            .setEmoji(emojis.play)
            .setStyle(ButtonStyle.Danger)
    );

export const unpausedButtons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('rewindButton')
            .setEmoji(emojis.rewind)
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('pauseButton')
            .setEmoji(emojis.pause)
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('skipButton')
            .setEmoji(emojis.skip)
            .setStyle(ButtonStyle.Success)
    );