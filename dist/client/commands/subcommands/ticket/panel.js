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
exports.panel = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../../../utils/localization");
const models_1 = require("../../../../models");
const config_1 = require("../../../../config");
const services_1 = require("../../../../services");
const ticketCategoryService_1 = __importDefault(require("../../../../services/ticketCategoryService"));
exports.panel = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('panel')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.panel.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.panel.name', 'pt-BR')
    })
        .setDescription('Sets the ticket panel channel')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.panel.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.panel.description', 'pt-BR')
    })
        .addChannelOption(new discord_js_1.SlashCommandChannelOption()
        .setName('channel')
        .addChannelTypes(discord_js_1.ChannelType.GuildText)
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.panel.options.channel.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.panel.options.channel.name', 'pt-BR')
    })
        .setDescription('Channel where the ticket panel will be sent')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.panel.options.channel.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.panel.options.channel.description', 'pt-BR')
    })
        .setRequired(true)),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const channel = interaction.options.getChannel('channel');
        if (!guild || !channel)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const categories = yield ticketCategoryService_1.default.getCategories(guild.id);
        if (categories.length === 0) {
            const embed = new models_1.Embed()
                .setColor(`#${config_1.colors.default_color}`)
                .setTitle((0, localization_1.t)('commands.ticket.subcommands.panel.response_title', locale))
                .setDescription((0, localization_1.t)('commands.ticket.subcommands.panel.no_categories', locale))
                .setTimestamp(new Date());
            return interaction.reply({ embeds: [embed.build()], flags: discord_js_1.MessageFlags.Ephemeral });
        }
        const guildData = yield services_1.guildService.getGuildById(guild.id);
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId('ticketPanelSettings')
            .setTitle((0, localization_1.t)('modals.ticketPanelSettings.title', locale));
        const channelIdInput = new discord_js_1.TextInputBuilder()
            .setCustomId('ticketPanelChannelId')
            .setLabel((0, localization_1.t)('modals.ticketPanelSettings.inputs.channelid.title', locale))
            .setPlaceholder((0, localization_1.t)('modals.ticketPanelSettings.inputs.channelid.placeholder', locale))
            .setStyle(discord_js_1.TextInputStyle.Short)
            .setValue(channel.id);
        const titleInput = new discord_js_1.TextInputBuilder()
            .setCustomId('ticketPanelTitle')
            .setLabel((0, localization_1.t)('modals.ticketPanelSettings.inputs.title.title', locale))
            .setStyle(discord_js_1.TextInputStyle.Short)
            .setPlaceholder((0, localization_1.t)('modals.ticketPanelSettings.inputs.title.placeholder', locale))
            .setRequired(true);
        if (guildData === null || guildData === void 0 ? void 0 : guildData.ticket_panel_title) {
            titleInput.setValue(guildData.ticket_panel_title);
        }
        const descriptionInput = new discord_js_1.TextInputBuilder()
            .setCustomId('ticketPanelDescription')
            .setLabel((0, localization_1.t)('modals.ticketPanelSettings.inputs.description.title', locale))
            .setStyle(discord_js_1.TextInputStyle.Paragraph)
            .setPlaceholder((0, localization_1.t)('modals.ticketPanelSettings.inputs.description.placeholder', locale))
            .setRequired(true);
        if (guildData === null || guildData === void 0 ? void 0 : guildData.ticket_panel_description) {
            descriptionInput.setValue(guildData.ticket_panel_description);
        }
        modal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(channelIdInput), new discord_js_1.ActionRowBuilder().addComponents(titleInput), new discord_js_1.ActionRowBuilder().addComponents(descriptionInput));
        return yield interaction.showModal(modal);
    }),
};
