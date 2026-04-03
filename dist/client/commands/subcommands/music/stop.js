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
exports.stop = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../../../utils/localization");
const models_1 = require("../../../../models");
const config_1 = require("../../../../config");
exports.stop = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('stop')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.music.subcommands.stop.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.music.subcommands.stop.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.music.subcommands.stop.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.music.subcommands.stop.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.music.subcommands.stop.description', 'pt-BR')
    }),
    usage: '/music stop',
    execute: (interaction, socket) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        if (!guild)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        yield interaction.deferReply({ ephemeral: true });
        const waitForWsResponse = (interactionId) => {
            return new Promise((resolve, reject) => {
                const onMessage = (data) => {
                    try {
                        const parsedData = JSON.parse(data.toString());
                        if (parsedData.interactionId === interactionId &&
                            (parsedData.event === 'stop_success' || parsedData.event === 'stop_error')) {
                            socket.off('message', onMessage);
                            resolve(parsedData);
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                };
                socket.on('message', onMessage);
                setTimeout(() => {
                    socket.off('message', onMessage);
                    reject(new Error('Timeout: No response from WebSocket'));
                }, 5000);
            });
        };
        socket.send(JSON.stringify({
            command: "stop",
            guildId: guild.id,
            interactionId: interaction.id
        }));
        try {
            const response = yield waitForWsResponse(interaction.id);
            const embed = new models_1.Embed();
            if (response.event === 'stop_error') {
                embed.setColor('#FF0000');
                if (response.error === 'NO_QUEUE') {
                    embed.setDescription((0, localization_1.t)('player.errors.not_connected', locale));
                }
                else {
                    embed.setDescription((0, localization_1.t)('misc.error_ocurred', locale));
                }
            }
            else {
                embed.setColor(`#${config_1.colors.default_color}`);
                embed.setDescription((0, localization_1.t)('commands.music.subcommands.stop.response.stopped', locale));
            }
            yield interaction.editReply({ embeds: [embed.build()] });
        }
        catch (error) {
            const embed = new models_1.Embed()
                .setColor('#FF0000')
                .setDescription((0, localization_1.t)('misc.error_ocurred', locale));
            yield interaction.editReply({ embeds: [embed.build()] });
        }
    }),
};
