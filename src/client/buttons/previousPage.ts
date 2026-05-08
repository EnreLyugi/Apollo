import { ButtonBuilder, ButtonStyle } from "discord.js"
import { emojis } from "../../config"

export const previousPageButton = new ButtonBuilder()
    .setCustomId('previousPageButton')
    .setEmoji(emojis.previousPage)
    .setStyle(ButtonStyle.Primary);