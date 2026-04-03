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
exports.play = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../../../utils/localization");
const models_1 = require("../../../../models");
const config_1 = require("../../../../config");
exports.play = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('play')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.music.subcommands.play.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.music.subcommands.play.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.music.subcommands.play.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.music.subcommands.play.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.music.subcommands.play.description', 'pt-BR')
    })
        .addStringOption(new discord_js_1.SlashCommandStringOption()
        .setName('music')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.music.subcommands.play.options.music.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.music.subcommands.play.options.music.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.music.subcommands.play.options.music.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.music.subcommands.play.options.music.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.music.subcommands.play.options.music.description', 'pt-BR')
    })
        .setRequired(true)),
    usage: '/music play',
    execute: (interaction, socket) => __awaiter(void 0, void 0, void 0, function* () {
        const music = interaction.options.getString('music');
        if (!music)
            return;
        const guild = interaction.guild;
        if (!guild)
            return;
        const member = guild.members.resolve(interaction.user.id);
        if (!member)
            return;
        const channel = member.voice.channel;
        if (!channel)
            return;
        const interactionChannel = interaction.channel;
        yield interaction.deferReply({ ephemeral: true });
        const waitForWsResponse = (interactionId) => {
            return new Promise((resolve, reject) => {
                const onMessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.interactionId === interactionId) {
                            socket.removeEventListener('message', onMessage);
                            resolve(data);
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                };
                socket.addEventListener('message', onMessage);
                setTimeout(() => {
                    socket.removeEventListener('message', onMessage);
                    reject(new Error('Timeout: No response from WebSocket'));
                }, 50000);
            });
        };
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        socket.send(JSON.stringify({
            command: "play",
            guildId: guild.id,
            channelId: channel.id,
            userId: member.id,
            music,
            interactionId: interaction.id,
            interactionChannelId: interactionChannel === null || interactionChannel === void 0 ? void 0 : interactionChannel.id
        }));
        try {
            const responseData = yield waitForWsResponse(interaction.id);
            const response = new models_1.Embed()
                .setColor(`#${config_1.colors.default_color}`)
                .setAuthor({ name: (0, localization_1.t)(`player.events.${responseData.event}`, locale) })
                .setThumbnail({ url: responseData.thumbnail });
            if (responseData.event == 'song_added') {
                response.setDescription(`[${responseData.name}](${responseData.url})
                    ${(0, localization_1.t)('misc.duration', locale)}: \`${responseData.duration}\``);
            }
            else if (responseData.event == 'playlist_added') {
                response.setDescription(`[${responseData.name}](${responseData.url})
                        
                        **${responseData.length}** ${(0, localization_1.t)('misc.songs', locale)}`);
            }
            else if (responseData.event == 'play_error') {
                response.setColor(`#FF0000`);
                response.setDescription(responseData.e);
            }
            yield interaction.editReply({ embeds: [response.build()] });
        }
        catch (error) {
            console.error('Error waiting for WebSocket response:', error);
            yield interaction.editReply({
                embeds: [
                    new models_1.Embed()
                        .setColor('#FF0000')
                        .setDescription((0, localization_1.t)('misc.error_ocurred', locale))
                        .build()
                ]
            });
        }
    }),
};
