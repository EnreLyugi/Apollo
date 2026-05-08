"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shop = exports.shopTypeRegistry = void 0;
exports.buildColorShopContainer = buildColorShopContainer;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../utils/localization");
const services_1 = require("../../services");
const config_1 = require("../../config");
const help_1 = require("./help");
const PAGE_SIZE = 25;
function buildColorShopContainer(guild_1, userId_1, locale_1) {
    return __awaiter(this, arguments, void 0, function* (guild, userId, locale, page = 0) {
        var _a, _b;
        const roles = yield services_1.colorRoleService.getGuildRoles(guild.id);
        if (!roles || roles.length === 0)
            return null;
        const guildData = yield services_1.guildService.getGuildById(guild.id);
        const price = (_a = guildData === null || guildData === void 0 ? void 0 : guildData.color_roles_price) !== null && _a !== void 0 ? _a : 1200;
        const memberData = yield services_1.memberService.getMember(userId, guild.id);
        const balance = (_b = memberData === null || memberData === void 0 ? void 0 : memberData.coin) !== null && _b !== void 0 ? _b : 0;
        const ownedIds = yield services_1.userColorService.getOwnedRoleIds(userId, guild.id);
        const sortedRoles = [...roles].sort((a, b) => {
            const aOwned = ownedIds.has(a.role_id) ? 0 : 1;
            const bOwned = ownedIds.has(b.role_id) ? 0 : 1;
            return aOwned - bOwned;
        });
        const totalPages = Math.ceil(sortedRoles.length / PAGE_SIZE);
        const pageRoles = sortedRoles.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
        const selectOptions = pageRoles.map(role => {
            const owned = ownedIds.has(role.role_id);
            const opt = new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel(role.name)
                .setValue(role.role_id);
            if (owned) {
                opt.setDescription((0, localization_1.t)('commands.shop.options.type.choices.roles.owned_label', locale));
                opt.setEmoji('✅');
            }
            else {
                opt.setDescription(`${price} coins`);
            }
            return opt;
        });
        const select = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId(`shopColorSelect:${page}`)
            .setPlaceholder((0, localization_1.t)('commands.shop.options.type.choices.roles.select_placeholder', locale))
            .addOptions(selectOptions);
        const description = (0, localization_1.format)((0, localization_1.t)('commands.shop.options.type.choices.roles.response.description', locale), { price: String(price), count: String(sortedRoles.length), balance: String(balance) });
        const pageInfo = totalPages > 1
            ? `\n${(0, localization_1.format)((0, localization_1.t)('commands.shop.page_info', locale), { current: String(page + 1), total: String(totalPages) })}`
            : '';
        const colorPreview = pageRoles.map((role, i) => {
            const num = (page * PAGE_SIZE) + i + 1;
            const mention = `<@&${role.role_id}>`;
            const owned = ownedIds.has(role.role_id);
            return owned ? `\`${String(num).padStart(2, ' ')}.\` ${mention} ✅` : `\`${String(num).padStart(2, ' ')}.\` ${mention}`;
        }).join('\n');
        const container = new discord_js_1.ContainerBuilder()
            .setAccentColor(parseInt(config_1.colors.default_color, 16))
            .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`## ${(0, localization_1.t)('commands.shop.options.type.choices.roles.response.title', locale)}\n${description}${pageInfo}`))
            .addSeparatorComponents(new discord_js_1.SeparatorBuilder().setSpacing(discord_js_1.SeparatorSpacingSize.Small))
            .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(colorPreview))
            .addSeparatorComponents(new discord_js_1.SeparatorBuilder().setSpacing(discord_js_1.SeparatorSpacingSize.Small))
            .addActionRowComponents(new discord_js_1.ActionRowBuilder().addComponents(select));
        if (totalPages > 1) {
            const navButtons = [];
            if (page > 0) {
                navButtons.push(new discord_js_1.ButtonBuilder()
                    .setCustomId(`shopColorPage:${page - 1}`)
                    .setLabel('◀')
                    .setStyle(discord_js_1.ButtonStyle.Secondary));
            }
            if (page < totalPages - 1) {
                navButtons.push(new discord_js_1.ButtonBuilder()
                    .setCustomId(`shopColorPage:${page + 1}`)
                    .setLabel('▶')
                    .setStyle(discord_js_1.ButtonStyle.Secondary));
            }
            if (navButtons.length > 0) {
                container.addActionRowComponents(new discord_js_1.ActionRowBuilder().addComponents(...navButtons));
            }
        }
        return container;
    });
}
exports.shopTypeRegistry = [
    {
        id: 'roles',
        label: (locale) => (0, localization_1.t)('commands.shop.options.type.choices.roles.response.title', locale),
        description: (locale) => (0, localization_1.t)('commands.shop.options.type.choices.roles.name', locale),
    },
];
exports.shop = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('shop')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.shop.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.shop.name', 'pt-BR')
    })
        .setDescription('Some shops to spend your coins')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.shop.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.shop.description', 'pt-BR')
    }),
    category: help_1.CommandCategory.ECONOMY,
    usage: '/shop',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        if (!guild)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        if (exports.shopTypeRegistry.length === 1) {
            const container = yield buildColorShopContainer(guild, interaction.user.id, locale);
            if (!container) {
                yield interaction.reply({ content: (0, localization_1.t)('commands.shop.empty', locale), flags: discord_js_1.MessageFlags.Ephemeral });
                return;
            }
            yield interaction.reply({
                components: [container],
                flags: discord_js_1.MessageFlags.IsComponentsV2 | discord_js_1.MessageFlags.Ephemeral,
            });
            return;
        }
        const selectOptions = exports.shopTypeRegistry.map(s => new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel(s.label(locale))
            .setValue(s.id)
            .setDescription(s.description(locale)));
        const select = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('shopTypeSelect')
            .setPlaceholder((0, localization_1.t)('commands.shop.type_select_placeholder', locale))
            .addOptions(selectOptions);
        const container = new discord_js_1.ContainerBuilder()
            .setAccentColor(parseInt(config_1.colors.default_color, 16))
            .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`## ${(0, localization_1.t)('commands.shop.type_select_title', locale)}\n${(0, localization_1.t)('commands.shop.type_select_description', locale)}`))
            .addSeparatorComponents(new discord_js_1.SeparatorBuilder().setSpacing(discord_js_1.SeparatorSpacingSize.Small))
            .addActionRowComponents(new discord_js_1.ActionRowBuilder().addComponents(select));
        yield interaction.reply({
            components: [container],
            flags: discord_js_1.MessageFlags.IsComponentsV2 | discord_js_1.MessageFlags.Ephemeral,
        });
    }),
};
