import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { mapLocale, t } from "../../utils/localization";
import { subcommands } from './subcommands/twitch';
import { CommandCategory } from "./help";

const commandData =
    new SlashCommandBuilder()
        .setName('twitch')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setNameLocalizations({
            "en-US": t('commands.twitch.name', 'en-US'),
            "pt-BR": t('commands.twitch.name', 'pt-BR')
        })
        .setDescription('Twitch live notification settings')
        .setDescriptionLocalizations({
            "en-US": t('commands.twitch.description', 'en-US'),
            "pt-BR": t('commands.twitch.description', 'pt-BR')
        });

const subcommandsMap = new Map();
subcommands.forEach(subcommand => {
    subcommandsMap.set(subcommand.data.name, subcommand);
    commandData.addSubcommand(subcommand.data);
});

export const twitch = {
    data: commandData,
    category: CommandCategory.CONFIG,
    usage: '/twitch',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const locale = mapLocale(interaction.locale);
        const subcommandName = interaction.options.getSubcommand();
        const subcommand = subcommandsMap.get(subcommandName);

        try {
            await subcommand.execute(interaction);
        } catch (error) {
            console.error(`Error executing twitch subcommand ${subcommandName}:`, error);
            await interaction.reply({ content: t('client.error_on_command', locale), flags: MessageFlags.Ephemeral });
        }
    },
};
