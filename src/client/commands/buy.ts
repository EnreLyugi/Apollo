import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { mapLocale, t } from "../../utils/localization";
import { subcommands } from './subcommands/buy';
import { CommandCategory } from "./help";

const commandData =
    new SlashCommandBuilder()
        .setName('buy')
        .setNameLocalizations({
            "en-US": t('commands.buy.name', 'en-US'),
            "pt-BR": t('commands.buy.name', 'pt-BR')
        })
        .setDescription('Buy items')
        .setDescriptionLocalizations({
            "en-US": t('commands.buy.description', 'en-US'),
            "pt-BR": t('commands.buy.description', 'pt-BR')
        });

const subcommandsMap = new Map();
subcommands.forEach(subcommand => {
    subcommandsMap.set(subcommand.data.name, subcommand);
    commandData.addSubcommand(subcommand.data)
});

export const buy = {
    data: commandData,
    category: CommandCategory.ECONOMY,
    usage: '/buy',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const locale = mapLocale(interaction.locale);
        const subcommandName = interaction.options.getSubcommand();
        const subcommand = subcommandsMap.get(subcommandName);

        try {
            await subcommand.execute(interaction, subcommand);
        } catch (error) {
            console.error(`Error executing command ${subcommandName}:`, error);
            await interaction.reply({ content: t(`client.error_on_command`, locale), ephemeral: true });
        }
    },
};