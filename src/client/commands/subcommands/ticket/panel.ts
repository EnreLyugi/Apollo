import {
    ActionRowBuilder,
    ChannelType,
    ChatInputCommandInteraction,
    MessageFlags,
    ModalBuilder,
    SlashCommandChannelOption,
    SlashCommandSubcommandBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";
import { guildService } from "../../../../services";
import ticketCategoryService from "../../../../services/ticketCategoryService";

export const panel = {
    data: new SlashCommandSubcommandBuilder()
        .setName('panel')
        .setNameLocalizations({
            "en-US": t('commands.ticket.subcommands.panel.name', 'en-US'),
            "pt-BR": t('commands.ticket.subcommands.panel.name', 'pt-BR')
        })
        .setDescription('Sets the ticket panel channel')
        .setDescriptionLocalizations({
            "en-US": t('commands.ticket.subcommands.panel.description', 'en-US'),
            "pt-BR": t('commands.ticket.subcommands.panel.description', 'pt-BR')
        })
        .addChannelOption(new SlashCommandChannelOption()
            .setName('channel')
            .addChannelTypes(ChannelType.GuildText)
            .setNameLocalizations({
                "en-US": t('commands.ticket.subcommands.panel.options.channel.name', 'en-US'),
                "pt-BR": t('commands.ticket.subcommands.panel.options.channel.name', 'pt-BR')
            })
            .setDescription('Channel where the ticket panel will be sent')
            .setDescriptionLocalizations({
                "en-US": t('commands.ticket.subcommands.panel.options.channel.description', 'en-US'),
                "pt-BR": t('commands.ticket.subcommands.panel.options.channel.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const channel = interaction.options.getChannel('channel');
        if (!guild || !channel) return;

        const locale = mapLocale(interaction.locale);
        const categories = await ticketCategoryService.getCategories(guild.id);

        if (categories.length === 0) {
            const embed = new Embed()
                .setColor(`#${colors.default_color}`)
                .setTitle(t('commands.ticket.subcommands.panel.response_title', locale))
                .setDescription(t('commands.ticket.subcommands.panel.no_categories', locale))
                .setTimestamp(new Date());
            return interaction.reply({ embeds: [embed.build()], flags: MessageFlags.Ephemeral });
        }

        const guildData = await guildService.getGuildById(guild.id);

        const modal = new ModalBuilder()
            .setCustomId('ticketPanelSettings')
            .setTitle(t('modals.ticketPanelSettings.title', locale));

        const channelIdInput = new TextInputBuilder()
            .setCustomId('ticketPanelChannelId')
            .setLabel(t('modals.ticketPanelSettings.inputs.channelid.title', locale))
            .setPlaceholder(t('modals.ticketPanelSettings.inputs.channelid.placeholder', locale))
            .setStyle(TextInputStyle.Short)
            .setValue(channel.id);

        const titleInput = new TextInputBuilder()
            .setCustomId('ticketPanelTitle')
            .setLabel(t('modals.ticketPanelSettings.inputs.title.title', locale))
            .setStyle(TextInputStyle.Short)
            .setPlaceholder(t('modals.ticketPanelSettings.inputs.title.placeholder', locale))
            .setRequired(true);

        if (guildData?.ticket_panel_title) {
            titleInput.setValue(guildData.ticket_panel_title);
        }

        const descriptionInput = new TextInputBuilder()
            .setCustomId('ticketPanelDescription')
            .setLabel(t('modals.ticketPanelSettings.inputs.description.title', locale))
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder(t('modals.ticketPanelSettings.inputs.description.placeholder', locale))
            .setRequired(true);

        if (guildData?.ticket_panel_description) {
            descriptionInput.setValue(guildData.ticket_panel_description);
        }

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(channelIdInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput),
        );

        return await interaction.showModal(modal);
    },
};
