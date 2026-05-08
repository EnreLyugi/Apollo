"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onInteractionCreate = void 0;
const discord_js_1 = require("discord.js");
const commands_1 = require("../commands");
const modals_1 = require("../modals");
const localization_1 = require("../../utils/localization");
const services_1 = require("../../services");
const ticketService_1 = __importDefault(require("../../services/ticketService"));
const ticketCategoryService_1 = __importDefault(require("../../services/ticketCategoryService"));
const config_1 = require("../../config");
const onInteractionCreate = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const commandMap = new Map();
    commands_1.commands.forEach(command => commandMap.set(command.data.name, command));
    const modalsMap = new Map();
    modals_1.modals.forEach(modal => modalsMap.set(modal.data.name, modal));
    const locale = (0, localization_1.mapLocale)(interaction.locale);
    if (interaction.isModalSubmit()) {
        const modalName = interaction.customId;
        const modal = modalsMap.get(modalName);
        if (!modal)
            return console.log(`\x1b[32m%s\x1b[0m`, `Modal ${modalName} not found!`);
        try {
            yield modal.execute(interaction);
        }
        catch (error) {
            console.error(error);
            yield interaction.reply({ content: (0, localization_1.t)(`client.error_on_command`, locale), flags: discord_js_1.MessageFlags.Ephemeral });
        }
    }
    if (interaction.isChatInputCommand()) {
        const commandName = interaction.commandName;
        const command = commandMap.get(commandName);
        if (!command)
            return console.log(`\x1b[32m%s\x1b[0m`, `Command ${commandName} not found!`);
        try {
            yield command.execute(interaction);
        }
        catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            yield interaction.reply({ content: (0, localization_1.t)(`client.error_on_command`, locale), flags: discord_js_1.MessageFlags.Ephemeral });
        }
    }
    if (interaction.isStringSelectMenu() && interaction.customId === 'ticketCategorySelect') {
        const guild = interaction.guild;
        if (!guild)
            return;
        const categoryId = parseInt(interaction.values[0]);
        const category = yield ticketCategoryService_1.default.getCategoryById(categoryId);
        if (!category) {
            return interaction.reply({ content: (0, localization_1.t)('commands.ticket.select.invalid_category', locale), flags: discord_js_1.MessageFlags.Ephemeral });
        }
        const existing = yield ticketService_1.default.getOpenTicketByUser(guild.id, interaction.user.id);
        if (existing) {
            return interaction.reply({ content: (0, localization_1.t)('commands.ticket.select.already_open', locale), flags: discord_js_1.MessageFlags.Ephemeral });
        }
        yield interaction.deferReply({ flags: discord_js_1.MessageFlags.Ephemeral });
        let ticketsCategory = guild.channels.cache.find(c => c.type === discord_js_1.ChannelType.GuildCategory && c.name === 'Tickets');
        if (!ticketsCategory) {
            ticketsCategory = yield guild.channels.create({
                name: 'Tickets',
                type: discord_js_1.ChannelType.GuildCategory,
            });
        }
        const guildData = yield services_1.guildService.getGuildById(guild.id);
        const ticketRoleId = guildData === null || guildData === void 0 ? void 0 : guildData.ticket_role;
        const permissionOverwrites = [
            { id: guild.id, deny: [discord_js_1.PermissionFlagsBits.ViewChannel], type: discord_js_1.OverwriteType.Role },
            { id: interaction.client.user.id, allow: [discord_js_1.PermissionFlagsBits.ViewChannel, discord_js_1.PermissionFlagsBits.SendMessages], type: discord_js_1.OverwriteType.Member },
        ];
        if (ticketRoleId) {
            permissionOverwrites.push({
                id: ticketRoleId,
                allow: [discord_js_1.PermissionFlagsBits.ViewChannel, discord_js_1.PermissionFlagsBits.SendMessages],
                type: discord_js_1.OverwriteType.Role,
            });
        }
        const ticketChannel = yield guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: discord_js_1.ChannelType.GuildText,
            parent: ticketsCategory.id,
            permissionOverwrites,
        });
        yield ticketService_1.default.createTicket(guild.id, interaction.user.id, ticketChannel.id, categoryId);
        const closeButton = new discord_js_1.ButtonBuilder()
            .setCustomId('closeTicket')
            .setLabel((0, localization_1.t)('commands.ticket.channel.close_button', locale))
            .setStyle(discord_js_1.ButtonStyle.Danger);
        const ticketEmbed = new discord_js_1.EmbedBuilder()
            .setColor(parseInt(config_1.colors.default_color, 16))
            .setTitle(`Ticket - ${interaction.user.tag}`)
            .setDescription(`**${(0, localization_1.t)('commands.ticket.channel.category_label', locale)}:** ${category.name}\n` +
            `**${(0, localization_1.t)('commands.ticket.channel.user_label', locale)}:** ${interaction.user.tag}\n\n` +
            (0, localization_1.t)('commands.ticket.channel.instructions', locale))
            .setTimestamp();
        yield ticketChannel.send({
            embeds: [ticketEmbed],
            components: [new discord_js_1.ActionRowBuilder().addComponents(closeButton)],
        });
        try {
            yield interaction.user.send((0, localization_1.t)('commands.ticket.select.dm_confirmation', locale)
                .replace('{guild}', guild.name)
                .replace('{category}', category.name));
        }
        catch (_a) { }
        yield interaction.editReply({ content: (0, localization_1.t)('commands.ticket.select.success', locale) });
    }
    if (interaction.isButton() && interaction.customId === 'closeTicket') {
        const channel = interaction.channel;
        const guild = interaction.guild;
        if (!channel || !guild)
            return;
        const ticket = yield ticketService_1.default.getTicketByChannel(channel.id);
        if (!ticket)
            return;
        yield ticketService_1.default.closeTicket(channel.id);
        try {
            const user = yield interaction.client.users.fetch(ticket.user_id);
            yield user.send((0, localization_1.t)('commands.ticket.close_dm', locale));
        }
        catch (_b) { }
        yield interaction.reply({ content: (0, localization_1.t)('commands.ticket.subcommands.close.closed', locale) });
    }
    if (interaction.isStringSelectMenu() && interaction.customId === 'shopTypeSelect') {
        const guild = interaction.guild;
        if (!guild)
            return;
        const { buildColorShopContainer } = yield Promise.resolve().then(() => __importStar(require('../commands/shop')));
        const shopId = interaction.values[0];
        if (shopId === 'roles') {
            const container = yield buildColorShopContainer(guild, interaction.user.id, locale);
            if (!container) {
                return interaction.update({ content: (0, localization_1.t)('commands.shop.empty', locale), components: [] });
            }
            yield interaction.update({
                components: [container],
                flags: discord_js_1.MessageFlags.IsComponentsV2,
            });
        }
    }
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('shopColorSelect:')) {
        const guild = interaction.guild;
        const member = interaction.member;
        if (!guild || !member)
            return;
        yield interaction.deferReply({ flags: discord_js_1.MessageFlags.Ephemeral });
        const roleId = interaction.values[0];
        const role = yield services_1.colorRoleService.getRole(roleId);
        if (!role) {
            return interaction.editReply({ content: (0, localization_1.t)('commands.shop.options.type.choices.roles.select_invalid', locale) });
        }
        const guildMember = guild.members.resolve(member.user.id);
        if (!guildMember)
            return;
        const owned = yield services_1.userColorService.hasColor(member.user.id, guild.id, roleId);
        if (owned) {
            const allColorRoles = yield services_1.colorRoleService.getGuildRoles(guild.id);
            if (allColorRoles) {
                for (const cr of allColorRoles) {
                    if (guildMember.roles.resolve(cr.role_id)) {
                        yield guildMember.roles.remove(cr.role_id).catch(() => { });
                    }
                }
            }
            yield guildMember.roles.add(roleId).catch(() => { });
            return interaction.editReply({
                content: (0, localization_1.format)((0, localization_1.t)('commands.shop.options.type.choices.roles.select_equipped', locale), {
                    role: `<@&${roleId}>`,
                    name: role.name,
                }),
            });
        }
        const guildData = yield services_1.guildService.getGuildById(guild.id);
        if (!guildData)
            return;
        const price = guildData.color_roles_price;
        const memberData = yield services_1.memberService.getMember(member.user.id, guild.id);
        if (!memberData)
            return;
        if (memberData.coin < price) {
            return interaction.editReply({
                content: (0, localization_1.format)((0, localization_1.t)('commands.buy.subcommands.color.response.insuficient', locale), {
                    coins: memberData.coin,
                    price,
                }),
            });
        }
        const confirmBtn = new discord_js_1.ButtonBuilder()
            .setCustomId(`shopColorConfirm:${roleId}`)
            .setLabel((0, localization_1.t)('commands.shop.options.type.choices.roles.confirm_button', locale))
            .setStyle(discord_js_1.ButtonStyle.Success);
        const cancelBtn = new discord_js_1.ButtonBuilder()
            .setCustomId('shopColorCancel')
            .setLabel((0, localization_1.t)('commands.shop.options.type.choices.roles.cancel_button', locale))
            .setStyle(discord_js_1.ButtonStyle.Secondary);
        return interaction.editReply({
            content: (0, localization_1.format)((0, localization_1.t)('commands.shop.options.type.choices.roles.confirm_prompt', locale), {
                name: role.name,
                role: `<@&${roleId}>`,
                price: String(price),
                balance: String(memberData.coin),
            }),
            components: [new discord_js_1.ActionRowBuilder().addComponents(confirmBtn, cancelBtn)],
        });
    }
    if (interaction.isButton() && interaction.customId.startsWith('shopColorConfirm:')) {
        const guild = interaction.guild;
        const member = interaction.member;
        if (!guild || !member)
            return;
        yield interaction.deferUpdate();
        const roleId = interaction.customId.split(':')[1];
        const role = yield services_1.colorRoleService.getRole(roleId);
        if (!role)
            return;
        const guildMember = guild.members.resolve(member.user.id);
        if (!guildMember)
            return;
        const alreadyOwned = yield services_1.userColorService.hasColor(member.user.id, guild.id, roleId);
        if (alreadyOwned) {
            return interaction.editReply({
                content: (0, localization_1.t)('commands.shop.options.type.choices.roles.select_already_owned', locale),
                components: [],
            });
        }
        const memberData = yield services_1.memberService.getMember(member.user.id, guild.id);
        const guildData = yield services_1.guildService.getGuildById(guild.id);
        if (!memberData || !guildData)
            return;
        const price = guildData.color_roles_price;
        if (memberData.coin < price) {
            return interaction.editReply({
                content: (0, localization_1.format)((0, localization_1.t)('commands.buy.subcommands.color.response.insuficient', locale), {
                    coins: memberData.coin,
                    price,
                }),
                components: [],
            });
        }
        memberData.coin -= price;
        yield memberData.save();
        yield services_1.userColorService.addColor(member.user.id, guild.id, roleId);
        const allColorRoles = yield services_1.colorRoleService.getGuildRoles(guild.id);
        if (allColorRoles) {
            for (const cr of allColorRoles) {
                if (guildMember.roles.resolve(cr.role_id)) {
                    yield guildMember.roles.remove(cr.role_id).catch(() => { });
                }
            }
        }
        yield guildMember.roles.add(roleId).catch(() => { });
        return interaction.editReply({
            content: (0, localization_1.format)((0, localization_1.t)('commands.shop.options.type.choices.roles.select_success', locale), {
                role: `<@&${roleId}>`,
                name: role.name,
            }),
            components: [],
        });
    }
    if (interaction.isButton() && interaction.customId === 'shopColorCancel') {
        yield interaction.update({
            content: (0, localization_1.t)('commands.shop.options.type.choices.roles.purchase_cancelled', locale),
            components: [],
        });
    }
    if (interaction.isButton() && interaction.customId.startsWith('shopColorPage:')) {
        const guild = interaction.guild;
        if (!guild)
            return;
        const page = parseInt(interaction.customId.split(':')[1]);
        const { buildColorShopContainer } = yield Promise.resolve().then(() => __importStar(require('../commands/shop')));
        const container = yield buildColorShopContainer(guild, interaction.user.id, locale, page);
        if (!container)
            return;
        yield interaction.update({
            components: [container],
            flags: discord_js_1.MessageFlags.IsComponentsV2,
        });
    }
});
exports.onInteractionCreate = onInteractionCreate;
