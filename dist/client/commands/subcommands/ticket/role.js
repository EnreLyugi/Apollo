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
exports.role = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../../../utils/localization");
const models_1 = require("../../../../models");
const config_1 = require("../../../../config");
const services_1 = require("../../../../services");
exports.role = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('role')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.role.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.role.name', 'pt-BR')
    })
        .setDescription('Sets the support role for tickets')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.role.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.role.description', 'pt-BR')
    })
        .addRoleOption(new discord_js_1.SlashCommandRoleOption()
        .setName('role')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.role.options.role.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.role.options.role.name', 'pt-BR')
    })
        .setDescription('Support role that will have access to tickets')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.ticket.subcommands.role.options.role.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.ticket.subcommands.role.options.role.description', 'pt-BR')
    })
        .setRequired(true)),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const roleOption = interaction.options.getRole('role');
        if (!guild || !roleOption)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        yield services_1.guildService.setRole('ticket_role', guild.id, roleOption.id);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)('commands.ticket.subcommands.role.response_title', locale))
            .setDescription((0, localization_1.format)((0, localization_1.t)('commands.ticket.subcommands.role.success', locale), { role: `<@&${roleOption.id}>` }))
            .setTimestamp(new Date());
        return interaction.reply({ embeds: [embed.build()], flags: discord_js_1.MessageFlags.Ephemeral });
    }),
};
