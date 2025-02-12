import { ButtonBuilder, ButtonStyle } from "discord.js"
import { emojis } from "../../config"

export const nextPageButton = new ButtonBuilder()
    .setCustomId('nextPageButton')
    .setEmoji(emojis.nextPage)
    .setStyle(ButtonStyle.Primary);