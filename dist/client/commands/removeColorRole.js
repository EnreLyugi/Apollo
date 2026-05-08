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
exports.removeColorRole = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models/");
const services_1 = require("../../services");
const localization_1 = require("../../utils/localization");
const config_1 = require("../../config");
const help_1 = require("./help");
exports.removeColorRole = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('removecolorrole')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.removecolorrole.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.removecolorrole.name', 'pt-BR')
    })
        .setDescription('Remove color roles from the shop')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.removecolorrole.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.removecolorrole.description', 'pt-BR')
    })
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .addRoleOption(new discord_js_1.SlashCommandRoleOption()
        .setName('role')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.removecolorrole.options.role.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.removecolorrole.options.role.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.addcolorrole.options.role.description', 'en-US'))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.removecolorrole.options.role.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.removecolorrole.options.role.description', 'pt-BR')
    })
        .setRequired(true)),
    category: help_1.CommandCategory.CONFIG,
    usage: '/removecolorrole <role>',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const role = interaction.options.getRole('role');
        if (!guild || !role)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)('commands.removecolorrole.response.title', locale))
            .setTimestamp(new Date());
        const isRoleAlreadySet = yield services_1.colorRoleService.getRole(role.id);
        if (isRoleAlreadySet == null) {
            embed.setDescription((0, localization_1.t)('commands.removecolorrole.response.role_dont_exists', locale));
            return interaction.reply({ embeds: [embed.build()] });
        }
        yield services_1.colorRoleService.removeRole(role.id);
        embed.setDescription((0, localization_1.format)((0, localization_1.t)('commands.removecolorrole.response.role_removed', locale), {
            "role": `<@&${role.id}>`,
            "name": `${isRoleAlreadySet.name}`
        }));
        return interaction.reply({ embeds: [embed.build()] });
    })
};
