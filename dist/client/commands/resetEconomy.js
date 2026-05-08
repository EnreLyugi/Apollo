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
exports.resetEconomy = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models");
const services_1 = require("../../services");
const localization_1 = require("../../utils/localization");
const config_1 = require("../../config");
const help_1 = require("./help");
exports.resetEconomy = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("reseteconomy")
        .setNameLocalizations({
        "en-US": (0, localization_1.t)("commands.reseteconomy.name", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.reseteconomy.name", "pt-BR"),
    })
        .setDescription("Reset all coins and color purchases in this server (admin only)")
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)("commands.reseteconomy.description", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.reseteconomy.description", "pt-BR"),
    })
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator),
    category: help_1.CommandCategory.ECONOMY,
    usage: "/reseteconomy",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const guild = interaction.guild;
        if (!guild)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        yield interaction.deferReply({ flags: discord_js_1.MessageFlags.Ephemeral });
        const colorRows = yield services_1.userColorService.getAllForGuild(guild.id);
        const byUser = new Map();
        for (const row of colorRows) {
            const list = (_a = byUser.get(row.user_id)) !== null && _a !== void 0 ? _a : [];
            list.push(row.role_id);
            byUser.set(row.user_id, list);
        }
        let membersStripped = 0;
        for (const [userId, roleIds] of byUser) {
            const gm = yield guild.members.fetch(userId).catch(() => null);
            if (!gm)
                continue;
            const uniqueRoles = [...new Set(roleIds)];
            yield gm.roles.remove(uniqueRoles).catch(() => { });
            membersStripped++;
        }
        const purchasesRemoved = yield services_1.userColorService.deleteAllForGuild(guild.id);
        const coinsResetRows = yield services_1.memberService.resetCoinsForGuild(guild.id);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)("commands.reseteconomy.response.title", locale))
            .setDescription((0, localization_1.format)((0, localization_1.t)("commands.reseteconomy.response.body", locale), {
            purchases: String(purchasesRemoved),
            members_colors: String(membersStripped),
            members_coins: String(coinsResetRows),
        }))
            .setTimestamp(new Date());
        yield interaction.editReply({ embeds: [embed.build()] });
    }),
};
