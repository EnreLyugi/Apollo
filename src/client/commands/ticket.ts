import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { mapLocale, t } from "../../utils/localization";
import { subcommands } from './subcommands/ticket';
import { CommandCategory } from "./help";

const commandData =
    new SlashCommandBuilder()
        .setName('ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setNameLocalizations({
            "en-US": t('commands.ticket.name', 'en-US'),
            "pt-BR": t('commands.ticket.name', 'pt-BR')
        })
        .setDescription('Ticket system configuration')
        .setDescriptionLocalizations({
            "en-US": t('commands.ticket.description', 'en-US'),
            "pt-BR": t('commands.ticket.description', 'pt-BR')
        });

const subcommandsMap = new Map();
subcommands.forEach(subcommand => {
    subcommandsMap.set(subcommand.data.name, subcommand);
    commandData.addSubcommand(subcommand.data);
});

export const ticket = {
    data: commandData,
    category: CommandCategory.CONFIG,
    usage: '/ticket',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const locale = mapLocale(interaction.locale);
        const subcommandName = interaction.options.getSubcommand();
        const subcommand = subcommandsMap.get(subcommandName);

        try {
            await subcommand.execute(interaction);
        } catch (error) {
            console.error(`Error executing ticket subcommand ${subcommandName}:`, error);
            await interaction.reply({ content: t('client.error_on_command', locale), flags: MessageFlags.Ephemeral });
        }
    },
};
