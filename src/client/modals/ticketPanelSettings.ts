import {
    ActionRowBuilder,
    ContainerBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    SeparatorBuilder,
    SeparatorSpacingSize,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextChannel,
    TextDisplayBuilder,
} from "discord.js";
import { guildService } from "../../services";
import ticketCategoryService from "../../services/ticketCategoryService";
import { mapLocale, t } from "../../utils/localization";

export const ticketPanelSettings = {
    data: {
        name: 'ticketPanelSettings'
    },
    execute: async (interaction: ModalSubmitInteraction) => {
        const guild = interaction.guild;
        if (!guild) return interaction.reply({ content: 'Erro!', flags: MessageFlags.Ephemeral });

        const locale = mapLocale(interaction.locale);
        const channelId = interaction.fields.getTextInputValue('ticketPanelChannelId');
        const title = interaction.fields.getTextInputValue('ticketPanelTitle');
        const description = interaction.fields.getTextInputValue('ticketPanelDescription');

        const channel = guild.channels.resolve(channelId) as TextChannel | null;
        if (!channel || !channel.isTextBased()) {
            return interaction.reply({ content: t('modals.ticketPanelSettings.invalid_channel', locale), flags: MessageFlags.Ephemeral });
        }

        await guildService.setChannel('ticket_channel', guild.id, channelId);
        await guildService.setTicketPanelText(guild.id, title, description);

        const categories = await ticketCategoryService.getCategories(guild.id);
        if (categories.length === 0) {
            return interaction.reply({ content: t('commands.ticket.subcommands.panel.no_categories', locale), flags: MessageFlags.Ephemeral });
        }

        const selectOptions = categories.map(cat => {
            const option = new StringSelectMenuOptionBuilder()
                .setLabel(cat.name)
                .setValue(String(cat.id));
            if (cat.description) option.setDescription(cat.description);
            return option;
        });

        const select = new StringSelectMenuBuilder()
            .setCustomId('ticketCategorySelect')
            .setPlaceholder(t('commands.ticket.panel.select_placeholder', locale))
            .addOptions(selectOptions);

        const container = new ContainerBuilder()
            .setAccentColor(0x5c23eb)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`## ${title}\n${description}`)
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
            )
            .addActionRowComponents(
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)
            );

        await channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        });

        await interaction.reply({
            content: t('commands.ticket.subcommands.panel.success', locale),
            flags: MessageFlags.Ephemeral,
        });
    },
};
