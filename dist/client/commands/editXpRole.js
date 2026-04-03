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
exports.editXpRole = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models/");
const services_1 = require("../../services");
const localization_1 = require("../../utils/localization");
const config_1 = require("../../config");
const help_1 = require("./help");
exports.editXpRole = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("editxprole")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .setNameLocalizations({
        "en-US": (0, localization_1.t)("commands.editxprole.name", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.editxprole.name", "pt-BR"),
    })
        .setDescription((0, localization_1.t)("commands.editxprole.description", "en-US"))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)("commands.editxprole.description", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.editxprole.description", "pt-BR"),
    })
        .addRoleOption(new discord_js_1.SlashCommandRoleOption()
        .setName("role")
        .setNameLocalizations({
        "en-US": (0, localization_1.t)("commands.addxprole.options.role.name", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.addxprole.options.role.name", "pt-BR"),
    })
        .setDescription((0, localization_1.t)("commands.addxprole.options.role.description", "en-US"))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)("commands.addxprole.options.role.description", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.addxprole.options.role.description", "pt-BR"),
    })
        .setRequired(true))
        .addIntegerOption(new discord_js_1.SlashCommandIntegerOption()
        .setName("xp")
        .setNameLocalizations({
        "en-US": (0, localization_1.t)("commands.addxprole.options.xp.name", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.addxprole.options.xp.name", "pt-BR"),
    })
        .setDescription((0, localization_1.t)("commands.editxprole.options.xp.description", "en-US"))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)("commands.editxprole.options.xp.description", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.editxprole.options.xp.description", "pt-BR"),
    })
        .setRequired(true)
        .setMinValue(0))
        .addIntegerOption(new discord_js_1.SlashCommandIntegerOption()
        .setName("level")
        .setNameLocalizations({
        "en-US": (0, localization_1.t)("commands.addxprole.options.level.name", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.addxprole.options.level.name", "pt-BR"),
    })
        .setDescription((0, localization_1.t)("commands.editxprole.options.level.description", "en-US"))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)("commands.editxprole.options.level.description", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.editxprole.options.level.description", "pt-BR"),
    })
        .setRequired(false)),
    category: help_1.CommandCategory.XP,
    usage: "/editxprole <role> <xp> [level]",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const role = interaction.options.getRole("role");
        const xp = interaction.options.getInteger("xp");
        const levelOpt = interaction.options.getInteger("level");
        if (!guild || !role || xp === null)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const existing = yield services_1.xpRoleService.getRole(role.id, guild.id);
        if (!existing) {
            return interaction.reply({
                content: (0, localization_1.t)("commands.editxprole.errors.not_configured", locale),
                ephemeral: true,
            });
        }
        try {
            yield services_1.xpRoleService.updateRoleXp(role.id, guild.id, xp, levelOpt !== null && levelOpt !== void 0 ? levelOpt : undefined);
        }
        catch (e) {
            console.error("editxprole save:", e);
            return interaction.reply({
                content: (0, localization_1.t)("commands.editxprole.errors.save_failed", locale),
                ephemeral: true,
            });
        }
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)("commands.editxprole.response.title", locale))
            .setTimestamp(new Date())
            .setDescription((0, localization_1.format)((0, localization_1.t)("commands.editxprole.response.body", locale), {
            role: `${role}`,
            level: levelOpt !== null && levelOpt !== void 0 ? levelOpt : existing.level,
            xp,
        }) +
            "\n\n" +
            (0, localization_1.t)("commands.editxprole.response.hint", locale));
        return interaction.reply({ embeds: [embed.build()] });
    }),
};
