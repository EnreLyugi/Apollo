import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandRoleOption,
    SlashCommandSubcommandBuilder
} from "discord.js";
import { format, mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";
import { guildService } from "../../../../services";

export const role = {
    data: new SlashCommandSubcommandBuilder()
        .setName('role')
        .setNameLocalizations({
            "en-US": t('commands.ticket.subcommands.role.name', 'en-US'),
            "pt-BR": t('commands.ticket.subcommands.role.name', 'pt-BR')
        })
        .setDescription('Sets the support role for tickets')
        .setDescriptionLocalizations({
            "en-US": t('commands.ticket.subcommands.role.description', 'en-US'),
            "pt-BR": t('commands.ticket.subcommands.role.description', 'pt-BR')
        })
        .addRoleOption(new SlashCommandRoleOption()
            .setName('role')
            .setNameLocalizations({
                "en-US": t('commands.ticket.subcommands.role.options.role.name', 'en-US'),
                "pt-BR": t('commands.ticket.subcommands.role.options.role.name', 'pt-BR')
            })
            .setDescription('Support role that will have access to tickets')
            .setDescriptionLocalizations({
                "en-US": t('commands.ticket.subcommands.role.options.role.description', 'en-US'),
                "pt-BR": t('commands.ticket.subcommands.role.options.role.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const roleOption = interaction.options.getRole('role');
        if (!guild || !roleOption) return;

        const locale = mapLocale(interaction.locale);

        await guildService.setRole('ticket_role', guild.id, roleOption.id);

        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t('commands.ticket.subcommands.role.response_title', locale))
            .setDescription(format(t('commands.ticket.subcommands.role.success', locale), { role: `<@&${roleOption.id}>` }))
            .setTimestamp(new Date());

        return interaction.reply({ embeds: [embed.build()], flags: MessageFlags.Ephemeral });
    },
};
