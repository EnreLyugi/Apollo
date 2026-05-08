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
exports.dm = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../utils/localization");
const help_1 = require("./help");
exports.dm = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('dm')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.dm.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.dm.name', 'pt-BR'),
    })
        .setDescription((0, localization_1.t)('commands.dm.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.dm.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.dm.description', 'pt-BR'),
    })
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addUserOption((option) => option
        .setName('user')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.dm.options.user.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.dm.options.user.name', 'pt-BR'),
    })
        .setDescription((0, localization_1.t)('commands.dm.options.user.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.dm.options.user.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.dm.options.user.description', 'pt-BR'),
    })
        .setRequired(true))
        .addStringOption((option) => option
        .setName('message')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.dm.options.message.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.dm.options.message.name', 'pt-BR'),
    })
        .setDescription((0, localization_1.t)('commands.dm.options.message.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.dm.options.message.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.dm.options.message.description', 'pt-BR'),
    })
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(2000)),
    category: help_1.CommandCategory.UTILITY,
    usage: '/dm user: @membro mensagem: texto',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        if (!guild)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const target = interaction.options.getUser('user', true);
        const text = interaction.options.getString('message', true);
        if (target.bot) {
            return interaction.reply({
                content: (0, localization_1.t)('commands.dm.response.error_bot', locale),
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
        yield interaction.deferReply({ flags: discord_js_1.MessageFlags.Ephemeral });
        try {
            yield target.send({ content: text });
            yield interaction.editReply({ content: (0, localization_1.t)('commands.dm.response.sent', locale) });
        }
        catch (_a) {
            yield interaction.editReply({ content: (0, localization_1.t)('commands.dm.response.error_cannot_dm', locale) });
        }
    }),
};
