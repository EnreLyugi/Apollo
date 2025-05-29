import {
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from "discord.js";
import { t } from "../../utils/localization";
import { CommandCategory } from "./help";

export const ping = {
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!'),
    category: CommandCategory.UTILITY,
    execute: async (interaction: ChatInputCommandInteraction) => {
      await interaction.reply('Pong!');
    },
};