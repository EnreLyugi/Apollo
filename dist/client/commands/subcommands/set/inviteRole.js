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
exports.inviteRole = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../../../utils/localization");
const models_1 = require("../../../../models");
const config_1 = require("../../../../config");
const services_1 = require("../../../../services");
const inviteCode_1 = require("../../../../utils/inviteCode");
exports.inviteRole = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName("invite-role")
        .setNameLocalizations({
        "en-US": (0, localization_1.t)("commands.set.subcommands.invite_role.name", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.set.subcommands.invite_role.name", "pt-BR"),
    })
        .setDescription((0, localization_1.t)("commands.set.subcommands.invite_role.description", "en-US"))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)("commands.set.subcommands.invite_role.description", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.set.subcommands.invite_role.description", "pt-BR"),
    })
        .addStringOption(new discord_js_1.SlashCommandStringOption()
        .setName("invite_code")
        .setNameLocalizations({
        "en-US": (0, localization_1.t)("commands.set.subcommands.invite_role.options.invite_code.name", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.set.subcommands.invite_role.options.invite_code.name", "pt-BR"),
    })
        .setDescription((0, localization_1.t)("commands.set.subcommands.invite_role.options.invite_code.description", "en-US"))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)("commands.set.subcommands.invite_role.options.invite_code.description", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.set.subcommands.invite_role.options.invite_code.description", "pt-BR"),
    })
        .setRequired(true))
        .addRoleOption(new discord_js_1.SlashCommandRoleOption()
        .setName("role")
        .setNameLocalizations({
        "en-US": (0, localization_1.t)("commands.set.subcommands.invite_role.options.role.name", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.set.subcommands.invite_role.options.role.name", "pt-BR"),
    })
        .setDescription((0, localization_1.t)("commands.set.subcommands.invite_role.options.role.description", "en-US"))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)("commands.set.subcommands.invite_role.options.role.description", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.set.subcommands.invite_role.options.role.description", "pt-BR"),
    })
        .setRequired(false)),
    usage: "/set invite-role",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const guild = interaction.guild;
        const rawCode = interaction.options.getString("invite_code", true);
        const role = interaction.options.getRole("role");
        if (!guild)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const code = (0, inviteCode_1.normalizeInviteCode)(rawCode);
        if (!code) {
            return interaction.reply({
                content: (0, localization_1.t)("commands.set.subcommands.invite_role.errors.invalid_code", locale),
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
        yield services_1.guildService.setInviteRole(guild.id, rawCode, (_a = role === null || role === void 0 ? void 0 : role.id) !== null && _a !== void 0 ? _a : null);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)("commands.setchannel.response_title", locale))
            .setTimestamp(new Date());
        if (role) {
            embed.setDescription((0, localization_1.format)((0, localization_1.t)("commands.set.subcommands.invite_role.response.set", locale), {
                code,
                role: role.name,
            }));
        }
        else {
            embed.setDescription((0, localization_1.format)((0, localization_1.t)("commands.set.subcommands.invite_role.response.removed", locale), {
                code,
            }));
        }
        return interaction.reply({ embeds: [embed.build()] });
    }),
};
