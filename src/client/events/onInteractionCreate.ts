import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    Interaction,
    MessageFlags,
    OverwriteType,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";
import { commands } from '../commands';
import { modals } from '../modals';
import { t, mapLocale } from '../../utils/localization';
import { guildService } from '../../services';
import ticketService from '../../services/ticketService';
import ticketCategoryService from '../../services/ticketCategoryService';
import { colors } from '../../config';

export const onInteractionCreate = async (interaction: Interaction) => {
    const commandMap = new Map();
    commands.forEach(command => commandMap.set(command.data.name, command));

    const modalsMap = new Map();
    modals.forEach(modal => modalsMap.set(modal.data.name, modal));

    const locale = mapLocale(interaction.locale);

    if (interaction.isModalSubmit()) {
        const modalName = interaction.customId;
        const modal = modalsMap.get(modalName);

        if (!modal) return console.log(`\x1b[32m%s\x1b[0m`, `Modal ${modalName} not found!`);
            
        try {
            await modal.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t(`client.error_on_command`, locale), flags: MessageFlags.Ephemeral });
        }
    }

    if (interaction.isChatInputCommand()) {
        const commandName = interaction.commandName;
        const command = commandMap.get(commandName);
        if (!command) return console.log(`\x1b[32m%s\x1b[0m`, `Command ${commandName} not found!`);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            await interaction.reply({ content: t(`client.error_on_command`, locale), flags: MessageFlags.Ephemeral });
        }
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'ticketCategorySelect') {
        const guild = interaction.guild;
        if (!guild) return;

        const categoryId = parseInt(interaction.values[0]);
        const category = await ticketCategoryService.getCategoryById(categoryId);
        if (!category) {
            return interaction.reply({ content: t('commands.ticket.select.invalid_category', locale), flags: MessageFlags.Ephemeral });
        }

        const existing = await ticketService.getOpenTicketByUser(guild.id, interaction.user.id);
        if (existing) {
            return interaction.reply({ content: t('commands.ticket.select.already_open', locale), flags: MessageFlags.Ephemeral });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        let ticketsCategory = guild.channels.cache.find(
            c => c.type === ChannelType.GuildCategory && c.name === 'Tickets'
        );
        if (!ticketsCategory) {
            ticketsCategory = await guild.channels.create({
                name: 'Tickets',
                type: ChannelType.GuildCategory,
            });
        }

        const guildData = await guildService.getGuildById(guild.id);
        const ticketRoleId = guildData?.ticket_role;

        const permissionOverwrites: any[] = [
            { id: guild.id, deny: [PermissionFlagsBits.ViewChannel], type: OverwriteType.Role },
            { id: interaction.client.user!.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages], type: OverwriteType.Member },
        ];

        if (ticketRoleId) {
            permissionOverwrites.push({
                id: ticketRoleId,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                type: OverwriteType.Role,
            });
        }

        const ticketChannel = await guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: ticketsCategory.id,
            permissionOverwrites,
        });

        await ticketService.createTicket(guild.id, interaction.user.id, ticketChannel.id, categoryId);

        const closeButton = new ButtonBuilder()
            .setCustomId('closeTicket')
            .setLabel(t('commands.ticket.channel.close_button', locale))
            .setStyle(ButtonStyle.Danger);

        const ticketEmbed = new EmbedBuilder()
            .setColor(parseInt(colors.default_color, 16))
            .setTitle(`Ticket - ${interaction.user.tag}`)
            .setDescription(
                `**${t('commands.ticket.channel.category_label', locale)}:** ${category.name}\n` +
                `**${t('commands.ticket.channel.user_label', locale)}:** ${interaction.user.tag}\n\n` +
                t('commands.ticket.channel.instructions', locale)
            )
            .setTimestamp();

        await ticketChannel.send({
            embeds: [ticketEmbed],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton)],
        });

        try {
            await interaction.user.send(
                t('commands.ticket.select.dm_confirmation', locale)
                    .replace('{guild}', guild.name)
                    .replace('{category}', category.name)
            );
        } catch {}

        await interaction.editReply({ content: t('commands.ticket.select.success', locale) });
    }

    if (interaction.isButton() && interaction.customId === 'closeTicket') {
        const channel = interaction.channel;
        const guild = interaction.guild;
        if (!channel || !guild) return;

        const ticket = await ticketService.getTicketByChannel(channel.id);
        if (!ticket) return;

        await ticketService.closeTicket(channel.id);

        try {
            const user = await interaction.client.users.fetch(ticket.user_id);
            await user.send(t('commands.ticket.close_dm', locale));
        } catch {}

        await interaction.reply({ content: t('commands.ticket.subcommands.close.closed', locale) });
    }
};