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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketPanelSettings = void 0;
const discord_js_1 = require("discord.js");
const services_1 = require("../../services");
const ticketCategoryService_1 = __importDefault(require("../../services/ticketCategoryService"));
const localization_1 = require("../../utils/localization");
exports.ticketPanelSettings = {
    data: {
        name: 'ticketPanelSettings'
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        if (!guild)
            return interaction.reply({ content: 'Erro!', flags: discord_js_1.MessageFlags.Ephemeral });
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const channelId = interaction.fields.getTextInputValue('ticketPanelChannelId');
        const title = interaction.fields.getTextInputValue('ticketPanelTitle');
        const description = interaction.fields.getTextInputValue('ticketPanelDescription');
        const channel = guild.channels.resolve(channelId);
        if (!channel || !channel.isTextBased()) {
            return interaction.reply({ content: (0, localization_1.t)('modals.ticketPanelSettings.invalid_channel', locale), flags: discord_js_1.MessageFlags.Ephemeral });
        }
        yield services_1.guildService.setChannel('ticket_channel', guild.id, channelId);
        yield services_1.guildService.setTicketPanelText(guild.id, title, description);
        const categories = yield ticketCategoryService_1.default.getCategories(guild.id);
        if (categories.length === 0) {
            return interaction.reply({ content: (0, localization_1.t)('commands.ticket.subcommands.panel.no_categories', locale), flags: discord_js_1.MessageFlags.Ephemeral });
        }
        const selectOptions = categories.map(cat => {
            const option = new discord_js_1.StringSelectMenuOptionBuilder()
                .setLabel(cat.name)
                .setValue(String(cat.id));
            if (cat.description)
                option.setDescription(cat.description);
            return option;
        });
        const select = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('ticketCategorySelect')
            .setPlaceholder((0, localization_1.t)('commands.ticket.panel.select_placeholder', locale))
            .addOptions(selectOptions);
        const container = new discord_js_1.ContainerBuilder()
            .setAccentColor(0x5c23eb)
            .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`## ${title}\n${description}`))
            .addSeparatorComponents(new discord_js_1.SeparatorBuilder().setSpacing(discord_js_1.SeparatorSpacingSize.Small))
            .addActionRowComponents(new discord_js_1.ActionRowBuilder().addComponents(select));
        yield channel.send({
            components: [container],
            flags: discord_js_1.MessageFlags.IsComponentsV2,
        });
        yield interaction.reply({
            content: (0, localization_1.t)('commands.ticket.subcommands.panel.success', locale),
            flags: discord_js_1.MessageFlags.Ephemeral,
        });
    }),
};
