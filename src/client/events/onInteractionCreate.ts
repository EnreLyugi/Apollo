import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    Interaction,
    MessageFlags,
    ModalBuilder,
    OverwriteType,
    PermissionFlagsBits,
    TextChannel,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { commands } from '../commands';
import { modals } from '../modals';
import { t, mapLocale, format } from '../../utils/localization';
import { colorRoleService, guildService, memberService, userColorService } from '../../services';
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

        if (modalName.startsWith('ticketCategoryEdit:')) {
            const guild = interaction.guild;
            if (!guild) return interaction.reply({ content: 'Erro!', flags: MessageFlags.Ephemeral });

            const categoryId = parseInt(modalName.split(':')[1]);
            const newName = interaction.fields.getTextInputValue('ticketCategoryEditName');
            const newDescription = interaction.fields.getTextInputValue('ticketCategoryEditDescription') || null;

            const category = await ticketCategoryService.getCategoryById(categoryId);
            if (!category) {
                return interaction.reply({ content: t('commands.ticket.subcommands.category.not_found', locale), flags: MessageFlags.Ephemeral });
            }

            const conflict = await ticketCategoryService.getCategoryByName(guild.id, newName);
            if (conflict && conflict.id !== categoryId) {
                return interaction.reply({ content: t('commands.ticket.subcommands.category.already_exists', locale), flags: MessageFlags.Ephemeral });
            }

            await ticketCategoryService.editCategory(categoryId, guild.id, newName, newDescription);

            return interaction.reply({
                content: format(t('commands.ticket.subcommands.category.edited', locale), { name: newName }),
                flags: MessageFlags.Ephemeral,
            });
        }

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

    if (interaction.isStringSelectMenu() && interaction.customId === 'ticketCategoryEditSelect') {
        const guild = interaction.guild;
        if (!guild) return;

        const categoryId = parseInt(interaction.values[0]);
        const category = await ticketCategoryService.getCategoryById(categoryId);
        if (!category) {
            return interaction.reply({ content: t('commands.ticket.subcommands.category.not_found', locale), flags: MessageFlags.Ephemeral });
        }

        const modal = new ModalBuilder()
            .setCustomId(`ticketCategoryEdit:${category.id}`)
            .setTitle(t('modals.ticketCategoryEdit.title', locale));

        const nameInput = new TextInputBuilder()
            .setCustomId('ticketCategoryEditName')
            .setLabel(t('modals.ticketCategoryEdit.inputs.name.title', locale))
            .setStyle(TextInputStyle.Short)
            .setPlaceholder(t('modals.ticketCategoryEdit.inputs.name.placeholder', locale))
            .setValue(category.name)
            .setRequired(true);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('ticketCategoryEditDescription')
            .setLabel(t('modals.ticketCategoryEdit.inputs.description.title', locale))
            .setStyle(TextInputStyle.Short)
            .setPlaceholder(t('modals.ticketCategoryEdit.inputs.description.placeholder', locale))
            .setValue(category.description || '')
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput)
        );

        return interaction.showModal(modal);
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'shopTypeSelect') {
        const guild = interaction.guild;
        if (!guild) return;

        const { buildColorShopContainer } = await import('../commands/shop');
        const shopId = interaction.values[0];

        if (shopId === 'roles') {
            const container = await buildColorShopContainer(guild, interaction.user.id, locale);
            if (!container) {
                return interaction.update({ content: t('commands.shop.empty', locale), components: [] });
            }
            await interaction.update({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });
        }
    }

    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('shopColorSelect:')) {
        const guild = interaction.guild;
        const member = interaction.member;
        if (!guild || !member) return;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const roleId = interaction.values[0];
        const role = await colorRoleService.getRole(roleId);
        if (!role) {
            return interaction.editReply({ content: t('commands.shop.options.type.choices.roles.select_invalid', locale) });
        }

        const guildMember = guild.members.resolve(member.user.id);
        if (!guildMember) return;

        const owned = await userColorService.hasColor(member.user.id, guild.id, roleId);

        if (owned) {
            const allColorRoles = await colorRoleService.getGuildRoles(guild.id);
            if (allColorRoles) {
                for (const cr of allColorRoles) {
                    if (guildMember.roles.resolve(cr.role_id)) {
                        await guildMember.roles.remove(cr.role_id).catch(() => {});
                    }
                }
            }
            await guildMember.roles.add(roleId).catch(() => {});
            return interaction.editReply({
                content: format(t('commands.shop.options.type.choices.roles.select_equipped', locale), {
                    role: `<@&${roleId}>`,
                    name: role.name,
                }),
            });
        }

        const guildData = await guildService.getGuildById(guild.id);
        if (!guildData) return;
        const price = guildData.color_roles_price;

        const memberData = await memberService.getMember(member.user.id, guild.id);
        if (!memberData) return;

        if (memberData.coin < price) {
            return interaction.editReply({
                content: format(t('commands.buy.subcommands.color.response.insuficient', locale), {
                    coins: memberData.coin,
                    price,
                }),
            });
        }

        const confirmBtn = new ButtonBuilder()
            .setCustomId(`shopColorConfirm:${roleId}`)
            .setLabel(t('commands.shop.options.type.choices.roles.confirm_button', locale))
            .setStyle(ButtonStyle.Success);
        const cancelBtn = new ButtonBuilder()
            .setCustomId('shopColorCancel')
            .setLabel(t('commands.shop.options.type.choices.roles.cancel_button', locale))
            .setStyle(ButtonStyle.Secondary);

        return interaction.editReply({
            content: format(t('commands.shop.options.type.choices.roles.confirm_prompt', locale), {
                name: role.name,
                role: `<@&${roleId}>`,
                price: String(price),
                balance: String(memberData.coin),
            }),
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(confirmBtn, cancelBtn)],
        });
    }

    if (interaction.isButton() && interaction.customId.startsWith('shopColorConfirm:')) {
        const guild = interaction.guild;
        const member = interaction.member;
        if (!guild || !member) return;

        await interaction.deferUpdate();

        const roleId = interaction.customId.split(':')[1];
        const role = await colorRoleService.getRole(roleId);
        if (!role) return;

        const guildMember = guild.members.resolve(member.user.id);
        if (!guildMember) return;

        const alreadyOwned = await userColorService.hasColor(member.user.id, guild.id, roleId);
        if (alreadyOwned) {
            return interaction.editReply({
                content: t('commands.shop.options.type.choices.roles.select_already_owned', locale),
                components: [],
            });
        }

        const memberData = await memberService.getMember(member.user.id, guild.id);
        const guildData = await guildService.getGuildById(guild.id);
        if (!memberData || !guildData) return;

        const price = guildData.color_roles_price;

        if (memberData.coin < price) {
            return interaction.editReply({
                content: format(t('commands.buy.subcommands.color.response.insuficient', locale), {
                    coins: memberData.coin,
                    price,
                }),
                components: [],
            });
        }

        memberData.coin -= price;
        await memberData.save();

        await userColorService.addColor(member.user.id, guild.id, roleId);

        const allColorRoles = await colorRoleService.getGuildRoles(guild.id);
        if (allColorRoles) {
            for (const cr of allColorRoles) {
                if (guildMember.roles.resolve(cr.role_id)) {
                    await guildMember.roles.remove(cr.role_id).catch(() => {});
                }
            }
        }
        await guildMember.roles.add(roleId).catch(() => {});

        return interaction.editReply({
            content: format(t('commands.shop.options.type.choices.roles.select_success', locale), {
                role: `<@&${roleId}>`,
                name: role.name,
            }),
            components: [],
        });
    }

    if (interaction.isButton() && interaction.customId === 'shopColorCancel') {
        await interaction.update({
            content: t('commands.shop.options.type.choices.roles.purchase_cancelled', locale),
            components: [],
        });
    }

    if (interaction.isButton() && interaction.customId.startsWith('shopColorPage:')) {
        const guild = interaction.guild;
        if (!guild) return;

        const page = parseInt(interaction.customId.split(':')[1]);
        const { buildColorShopContainer } = await import('../commands/shop');
        const container = await buildColorShopContainer(guild, interaction.user.id, locale, page);
        if (!container) return;

        await interaction.update({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        });
    }
};