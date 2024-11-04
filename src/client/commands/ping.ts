import {
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from "discord.js";

export const ping = {
    data: new SlashCommandBuilder()
      .setName('ping'),
    usage: '/ping',
    execute: async (interaction: ChatInputCommandInteraction) => {
      await interaction.reply('Pong!');
    },
};