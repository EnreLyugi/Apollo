import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { mapLocale, t } from "../../utils/localization";
import { subcommands } from './subcommands/youtube';
import { CommandCategory } from "./help";

const commandData =
    new SlashCommandBuilder()
        .setName('youtube')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setNameLocalizations({
            "en-US": t('commands.youtube.name', 'en-US'),
            "pt-BR": t('commands.youtube.name', 'pt-BR')
        })
        .setDescription('YouTube notification settings')
        .setDescriptionLocalizations({
            "en-US": t('commands.youtube.description', 'en-US'),
            "pt-BR": t('commands.youtube.description', 'pt-BR')
        });

const subcommandsMap = new Map();
subcommands.forEach(subcommand => {
    subcommandsMap.set(subcommand.data.name, subcommand);
    commandData.addSubcommand(subcommand.data);
});

export const youtube = {
    data: commandData,
    category: CommandCategory.CONFIG,
    usage: '/youtube',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const locale = mapLocale(interaction.locale);
        const subcommandName = interaction.options.getSubcommand();
        const subcommand = subcommandsMap.get(subcommandName);

        try {
            await subcommand.execute(interaction);
        } catch (error) {
            console.error(`Error executing youtube subcommand ${subcommandName}:`, error);
            await interaction.reply({ content: t('client.error_on_command', locale), flags: MessageFlags.Ephemeral });
        }
    },
};
