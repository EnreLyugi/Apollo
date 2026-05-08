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
exports.category = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../../../utils/localization");
const models_1 = require("../../../../models");
const config_1 = require("../../../../config");
const ticketCategoryService_1 = __importDefault(require("../../../../services/ticketCategoryService"));
exports.category = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('category')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.category.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.category.name', 'pt-BR')
    })
        .setDescription('Manages ticket categories')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.category.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.category.description', 'pt-BR')
    })
        .addStringOption(new discord_js_1.SlashCommandStringOption()
        .setName('action')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.category.options.action.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.category.options.action.name', 'pt-BR')
    })
        .setDescription('Action to perform')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.category.options.action.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.category.options.action.description', 'pt-BR')
    })
        .setChoices({ name: 'add', name_localizations: { "pt-BR": "adicionar" }, value: 'add' }, { name: 'remove', name_localizations: { "pt-BR": "remover" }, value: 'remove' })
        .setRequired(true))
        .addStringOption(new discord_js_1.SlashCommandStringOption()
        .setName('name')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.category.options.name.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.category.options.name.name', 'pt-BR')
    })
        .setDescription('Category name')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.category.options.name.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.category.options.name.description', 'pt-BR')
    })
        .setRequired(true))
        .addStringOption(new discord_js_1.SlashCommandStringOption()
        .setName('description')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.category.options.description.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.category.options.description.name', 'pt-BR')
    })
        .setDescription('Category description (only for add)')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.category.options.description.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.category.options.description.description', 'pt-BR')
    })
        .setRequired(false)),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        if (!guild)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const action = interaction.options.getString('action');
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)('commands.ticket.subcommands.category.response_title', locale))
            .setTimestamp(new Date());
        if (action === 'add') {
            const existing = yield ticketCategoryService_1.default.getCategoryByName(guild.id, name);
            if (existing) {
                embed.setDescription((0, localization_1.t)('commands.ticket.subcommands.category.already_exists', locale));
                return interaction.reply({ embeds: [embed.build()], flags: discord_js_1.MessageFlags.Ephemeral });
            }
            yield ticketCategoryService_1.default.addCategory(guild.id, name, description || undefined);
            embed.setDescription((0, localization_1.format)((0, localization_1.t)('commands.ticket.subcommands.category.added', locale), { name }));
        }
        else {
            const existing = yield ticketCategoryService_1.default.getCategoryByName(guild.id, name);
            if (!existing) {
                embed.setDescription((0, localization_1.t)('commands.ticket.subcommands.category.not_found', locale));
                return interaction.reply({ embeds: [embed.build()], flags: discord_js_1.MessageFlags.Ephemeral });
            }
            yield ticketCategoryService_1.default.removeCategory(existing.id, guild.id);
            embed.setDescription((0, localization_1.format)((0, localization_1.t)('commands.ticket.subcommands.category.removed', locale), { name }));
        }
        return interaction.reply({ embeds: [embed.build()], flags: discord_js_1.MessageFlags.Ephemeral });
    }),
};
