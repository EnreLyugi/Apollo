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
exports.channel = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../../../models/");
const services_1 = require("../../../../services");
const localization_1 = require("../../../../utils/localization");
const config_1 = require("../../../../config");
const services_2 = require("../../../../services");
exports.channel = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('channel')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.channel.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.channel.name', 'pt-BR'),
    })
        .setDescription("Sets a channel")
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.channel.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.channel.description', 'pt-BR'),
    })
        .addStringOption(new discord_js_1.SlashCommandStringOption()
        .setName('channeltype')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.channel.options.channeltype.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.channel.options.channeltype.name', 'pt-BR')
    })
        .setDescription("Type of the channel to be set")
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.channel.options.channeltype.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.channel.options.channeltype.description', 'pt-BR')
    })
        .setChoices([
        {
            "name": "welcome_channel",
            "name_localizations": {
                "en-US": (0, localization_1.t)('commands.set.subcommands.channel.options.channeltype.choices.welcome_channel.name', 'en-US'),
                "pt-BR": (0, localization_1.t)('commands.set.subcommands.channel.options.channeltype.choices.welcome_channel.name', 'pt-BR')
            },
            "value": "welcome_channel"
        },
        {
            "name": "birthday_channel",
            "name_localizations": {
                "en-US": (0, localization_1.t)('commands.set.subcommands.channel.options.channeltype.choices.birthday_channel.name', 'en-US'),
                "pt-BR": (0, localization_1.t)('commands.set.subcommands.channel.options.channeltype.choices.birthday_channel.name', 'pt-BR')
            },
            "value": "birthday_channel"
        },
        {
            "name": "voice_activity_log_channel",
            "name_localizations": {
                "en-US": (0, localization_1.t)('commands.set.subcommands.channel.options.channeltype.choices.voice_activity_log_channel.name', 'en-US'),
                "pt-BR": (0, localization_1.t)('commands.set.subcommands.channel.options.channeltype.choices.voice_activity_log_channel.name', 'pt-BR')
            },
            "value": "voice_activity_log_channel"
        }
    ])
        .setRequired(true))
        .addChannelOption(new discord_js_1.SlashCommandChannelOption()
        .setName('textchannel')
        .addChannelTypes(discord_js_1.ChannelType.GuildText)
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.channel.options.channel.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.channel.options.channel.name', 'pt-BR')
    })
        .setDescription("Channel to be set")
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.channel.options.channel.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.channel.options.channel.description', 'pt-BR')
    })
        .setRequired(true)),
    usage: '/set channel <channeltype> <channel>',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const channelType = interaction.options.getString('channeltype');
        const channel = interaction.options.getChannel('textchannel');
        if (!guild || !channel || !channelType)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)('commands.set.subcommands.channel.response_title', locale))
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
        embed.setDescription((0, localization_1.format)((0, localization_1.t)(`commands.set.subcommands.channel.response_body`, locale), {
            "channelType": (0, localization_1.t)(`commands.set.subcommands.channel.options.channeltype.choices.${channelType}.name`, locale)
        }));
        return interaction.reply({ embeds: [embed.build()] });
    })
};
