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
exports.syncXpRoles = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models/");
const member_1 = __importDefault(require("../../models/member"));
const services_1 = require("../../services");
const localization_1 = require("../../utils/localization");
const config_1 = require("../../config");
const help_1 = require("./help");
exports.syncXpRoles = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("syncxproles")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .setNameLocalizations({
        "en-US": (0, localization_1.t)("commands.syncxproles.name", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.syncxproles.name", "pt-BR"),
    })
        .setDescription((0, localization_1.t)("commands.syncxproles.description", "en-US"))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)("commands.syncxproles.description", "en-US"),
        "pt-BR": (0, localization_1.t)("commands.syncxproles.description", "pt-BR"),
    }),
    category: help_1.CommandCategory.XP,
    usage: "/syncxproles",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        if (!guild)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        yield interaction.deferReply();
        const pending = yield member_1.default.count({
            where: { guild_id: guild.id },
        });
        if (pending === 0) {
            return interaction.editReply({
                content: (0, localization_1.t)("commands.syncxproles.response.empty", locale),
            });
        }
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)("commands.syncxproles.response.title", locale))
            .setTimestamp(new Date())
            .setDescription((0, localization_1.format)((0, localization_1.t)("commands.syncxproles.response.started", locale), {
            pending,
        }));
        yield interaction.editReply({ embeds: [embed.build()] });
        void (() => __awaiter(void 0, void 0, void 0, function* () {
            let synced;
            try {
                synced = yield services_1.xpService.resyncGuildXpRoles(guild);
            }
            catch (e) {
                console.error("syncxproles resync:", e);
                try {
                    yield interaction.followUp({
                        content: (0, localization_1.t)("commands.syncxproles.errors.sync_failed", locale),
                        ephemeral: true,
                    });
                }
                catch (fe) {
                    console.error("syncxproles followUp (erro):", fe);
                }
                return;
            }
            try {
                yield interaction.followUp({
                    content: (0, localization_1.format)((0, localization_1.t)("commands.syncxproles.response.followup", locale), { synced }),
                    ephemeral: true,
                });
            }
            catch (fe) {
                console.error("syncxproles followUp (sucesso):", fe);
                try {
                    yield interaction.followUp({
                        content: (0, localization_1.t)("commands.syncxproles.errors.followup_expired", locale),
                        ephemeral: true,
                    });
                }
                catch (_a) {
                    /* interação expirou */
                }
            }
        }))();
    }),
};
