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
exports.enablexp = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models/");
const services_1 = require("../../services");
const localization_1 = require("../../utils/localization");
const config_1 = require("../../config");
const help_1 = require("./help");
exports.enablexp = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('enablexp')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.enablexp.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.enablexp.name', 'pt-BR')
    })
        .setDescription('Enable XP gain in a channel')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.enablexp.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.enablexp.description', 'pt-BR')
    })
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .addChannelOption(new discord_js_1.SlashCommandChannelOption()
        .setName('channel')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.enablexp.options.channel.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.enablexp.options.channel.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.enablexp.options.channel.description', 'en-US'))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.enablexp.options.channel.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.enablexp.options.channel.description', 'pt-BR')
    })
        .setRequired(true)),
    category: help_1.CommandCategory.XP,
    usage: '/enablexp <channel>',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const channel = interaction.options.getChannel('channel');
        if (!guild || !channel)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)('commands.enablexp.response_title', locale))
            .setTimestamp(new Date());
        const isChannelDisabled = yield services_1.xpChannelService.getChannel(channel.id, guild.id);
        if (isChannelDisabled == null) {
            embed.setDescription((0, localization_1.t)('commands.enablexp.channel_already_enabled', locale));
            return interaction.reply({ embeds: [embed.build()] });
        }
        yield services_1.xpChannelService.removeChannel(channel.id, guild.id);
        embed.setDescription((0, localization_1.format)((0, localization_1.t)('commands.enablexp.xp_enabled', locale), {
            "channel_id": channel.id
        }));
        return interaction.reply({ embeds: [embed.build()] });
    })
};
