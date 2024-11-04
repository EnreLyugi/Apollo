import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { mapLocale, t } from "../../utils/localization";
import { subcommands } from './subcommands/set';

const commandData =
    new SlashCommandBuilder()
        .setName('set')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setNameLocalizations({
            "en-US": t('commands.set.name', 'en-US'),
            "pt-BR": t('commands.set.name', 'pt-BR')
        });

const subcommandsMap = new Map();
subcommands.forEach(subcommand => {
    subcommandsMap.set(subcommand.data.name, subcommand);
    commandData.addSubcommand(subcommand.data)
});

export const set = {
    data: commandData,
    usage: '/set',
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