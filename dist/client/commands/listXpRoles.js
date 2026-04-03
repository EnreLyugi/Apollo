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
exports.listXpRoles = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models/");
const services_1 = require("../../services");
const localization_1 = require("../../utils/localization");
const config_1 = require("../../config");
const help_1 = require("./help");
exports.listXpRoles = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("listxproles")
        .setNameLocalizations({
        "en-US": (0, localization_1.t)("commands.listxproles.name", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.listxproles.name", "pt-BR"),
    })
        .setDescription((0, localization_1.t)("commands.listxproles.description", "en-US"))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)("commands.listxproles.description", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.listxproles.description", "pt-BR"),
    }),
    category: help_1.CommandCategory.XP,
    usage: "/listxproles",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        if (!guild)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const rows = yield services_1.xpRoleService.listRolesByGuild(guild.id);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
            .setTitle((0, localization_1.t)("commands.listxproles.response.title", locale))
            .setTimestamp(new Date());
        if (rows.length === 0) {
            embed.setDescription((0, localization_1.t)("commands.listxproles.response.empty", locale));
            return interaction.reply({ embeds: [embed.build()] });
        }
        const lines = rows.map((row) => {
            const discordRole = guild.roles.resolve(row.role_id);
            const roleLabel = discordRole ? `${discordRole}` : `\`${row.role_id}\``;
            return (0, localization_1.format)((0, localization_1.t)("commands.listxproles.response.line", locale), {
                role: roleLabel,
                level: row.level,
                xp: row.xp,
            });
        });
        let body = lines.join("\n");
        const maxLen = 3900;
        if (body.length > maxLen) {
            body =
                body.slice(0, maxLen) +
                    "\n… " +
                    (0, localization_1.t)("commands.listxproles.response.truncated", locale);
        }
        embed.setDescription(body);
        return interaction.reply({ embeds: [embed.build()] });
    }),
};
