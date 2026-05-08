import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandSubcommandBuilder
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";
import ticketService from "../../../../services/ticketService";

export const close = {
    data: new SlashCommandSubcommandBuilder()
        .setName('close')
        .setNameLocalizations({
            "en-US": t('commands.ticket.subcommands.close.name', 'en-US'),
            "pt-BR": t('commands.ticket.subcommands.close.name', 'pt-BR')
        })
        .setDescription('Closes the current ticket')
        .setDescriptionLocalizations({
            "en-US": t('commands.ticket.subcommands.close.description', 'en-US'),
            "pt-BR": t('commands.ticket.subcommands.close.description', 'pt-BR')
        }),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const channel = interaction.channel;
        if (!guild || !channel) return;

        const locale = mapLocale(interaction.locale);

        const ticket = await ticketService.getTicketByChannel(channel.id);
        if (!ticket) {
            const embed = new Embed()
                .setColor(`#${colors.default_color}`)
                .setTitle(t('commands.ticket.subcommands.close.response_title', locale))
                .setDescription(t('commands.ticket.subcommands.close.not_a_ticket', locale))
                .setTimestamp(new Date());
            return interaction.reply({ embeds: [embed.build()], flags: MessageFlags.Ephemeral });
        }

        await ticketService.closeTicket(channel.id);

        try {
            const user = await interaction.client.users.fetch(ticket.user_id);
            await user.send(t('commands.ticket.close_dm', locale));
        } catch {}

        await interaction.reply({ content: t('commands.ticket.subcommands.close.closed', locale) });
    },
};
