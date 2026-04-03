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
exports.setChannel = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models/");
const services_1 = require("../../services");
const localization_1 = require("../../utils/localization");
const config_1 = require("../../config");
const services_2 = require("../../services");
const help_1 = require("./help");
exports.setChannel = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('setchannel')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.setchannel.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.setchannel.name', 'pt-BR')
    })
        .setDescription('Setup a channel for automatic messages')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.setchannel.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.setchannel.description', 'pt-BR')
    })
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .addStringOption(new discord_js_1.SlashCommandStringOption()
        .setName('channeltype')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.setchannel.options.channeltype.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.setchannel.options.channeltype.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.setchannel.options.channeltype.description', 'en-US'))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.setchannel.options.channeltype.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.setchannel.options.channeltype.description', 'pt-BR')
    })
        .setChoices([
        {
            "name": "welcome_channel",
            "name_localizations": {
                "en-US": (0, localization_1.t)('commands.setchannel.options.channeltype.choices.welcome_channel.name', 'en-US'),
                "pt-BR": (0, localization_1.t)('commands.setchannel.options.channeltype.choices.welcome_channel.name', 'pt-BR')
            },
            "value": "welcome_channel"
        },
        {
            "name": "voice_activity_log_channel",
            "name_localizations": {
                "en-US": (0, localization_1.t)('commands.setchannel.options.channeltype.choices.voice_activity_log_channel.name', 'en-US'),
                "pt-BR": (0, localization_1.t)('commands.setchannel.options.channeltype.choices.voice_activity_log_channel.name', 'pt-BR')
            },
            "value": "voice_activity_log_channel"
        }
    ])
        .setRequired(true))
        .addChannelOption(new discord_js_1.SlashCommandChannelOption()
        .setName('channel')
        .addChannelTypes(discord_js_1.ChannelType.GuildText)
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.setchannel.options.channel.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.setchannel.options.channel.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.setchannel.options.channel.description', 'en-US'))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.setchannel.options.channel.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.setchannel.options.channel.description', 'pt-BR')
    })
        .setRequired(true)),
    category: help_1.CommandCategory.CONFIG,
    usage: '/setchannel <channeltype> <channel>',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const channelType = interaction.options.getString('channeltype');
        const channel = interaction.options.getChannel('channel');
        if (!guild || !channel || !channelType)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)('commands.setchannel.response_title', locale))
            .setTimestamp(new Date());
        switch (channelType) {
            case 'welcome_channel':
                const currentSettings = yield services_2.welcomeSettingsService.fetch(guild.id);
                const modal = new discord_js_1.ModalBuilder()
                    .setCustomId('welcomeSettings')
                    .setTitle((0, localization_1.t)('modals.welcomeSettings.title', locale));
                const channelIdInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('channelId')
                    .setLabel((0, localization_1.t)('modals.welcomeSettings.inputs.channelid.title', locale))
                    .setPlaceholder((0, localization_1.t)('modals.welcomeSettings.inputs.channelid.placeholder', locale))
                    .setStyle(discord_js_1.TextInputStyle.Short)
                    .setValue(channel.id);
                const titleInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('welcomeTitle')
                    .setLabel((0, localization_1.t)('modals.welcomeSettings.inputs.title.title', locale))
                    .setStyle(discord_js_1.TextInputStyle.Short)
                    .setPlaceholder((0, localization_1.t)('modals.welcomeSettings.inputs.title.placeholder', locale))
                    .setRequired(true);
                const descriptionInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('welcomeDescription')
                    .setLabel((0, localization_1.t)('modals.welcomeSettings.inputs.description.title', locale))
                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                    .setPlaceholder((0, localization_1.t)('modals.welcomeSettings.inputs.description.placeholder', locale))
                    .setRequired(true);
                const imageInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('welcomeImage')
                    .setLabel((0, localization_1.t)('modals.welcomeSettings.inputs.image.title', locale))
                    .setStyle(discord_js_1.TextInputStyle.Short)
                    .setPlaceholder((0, localization_1.t)('modals.welcomeSettings.inputs.image.placeholder', locale))
                    .setRequired(false);
                if (currentSettings) {
                    titleInput.setValue(currentSettings.title);
                    descriptionInput.setValue(currentSettings.description);
                    imageInput.setValue(currentSettings.image);
                }
                modal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(channelIdInput), new discord_js_1.ActionRowBuilder().addComponents(titleInput), new discord_js_1.ActionRowBuilder().addComponents(descriptionInput), new discord_js_1.ActionRowBuilder().addComponents(imageInput));
                return yield interaction.showModal(modal);
            default:
                yield services_1.guildService.setChannel(channelType, guild.id, channel.id);
                break;
        }
        embed.setDescription((0, localization_1.format)((0, localization_1.t)(`commands.setchannel.response_body`, locale), {
            "channelType": (0, localization_1.t)(`commands.setchannel.options.channeltype.choices.${channelType}.name`, locale)
        }));
        return interaction.reply({ embeds: [embed.build()] });
    })
};
