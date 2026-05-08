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
exports.addXpRole = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models/");
const services_1 = require("../../services");
const localization_1 = require("../../utils/localization");
const config_1 = require("../../config");
exports.addXpRole = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('addxprole')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .addRoleOption(new discord_js_1.SlashCommandRoleOption()
        .setName('role')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.addxprole.options.role.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.addxprole.options.role.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.addxprole.options.role.description', 'en-US'))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.addxprole.options.role.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.addxprole.options.role.description', 'pt-BR')
    })
        .setRequired(true))
        .addIntegerOption(new discord_js_1.SlashCommandIntegerOption()
        .setName('level')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.addxprole.options.level.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.addxprole.options.level.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.addxprole.options.level.description', 'en-US'))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.addxprole.options.level.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.addxprole.options.level.description', 'pt-BR')
    })
        .setRequired(true))
        .addIntegerOption(new discord_js_1.SlashCommandIntegerOption()
        .setName('xp')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.addxprole.options.xp.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.addxprole.options.xp.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.addxprole.options.xp.description', 'en-US'))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.addxprole.options.xp.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.addxprole.options.xp.description', 'pt-BR')
    })
        .setRequired(true)),
    usage: '/addxprole <role> <level> <xp>',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const role = interaction.options.getRole('role');
        const level = interaction.options.getInteger('level');
        const xp = interaction.options.getInteger('xp');
        if (!guild || !role || !level || !xp)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)('commands.addxprole.response.title', locale))
            .setTimestamp(new Date());
        const isRoleAlreadySet = yield services_1.xpRoleService.getRole(role.id, guild.id);
        if (isRoleAlreadySet !== null) {
            embed.setDescription((0, localization_1.t)('commands.addxprole.response.role_already_exists', locale));
            return interaction.reply({ embeds: [embed.build()] });
        }
        yield services_1.xpRoleService.addRole(role.id, guild.id, level, xp);
        embed.setDescription((0, localization_1.format)((0, localization_1.t)('commands.addxprole.response.role_setup', locale), {
            "role": `${role}`,
            "level": level,
            "xp": xp
        }));
        return interaction.reply({ embeds: [embed.build()] });
    })
};
