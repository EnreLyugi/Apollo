import { ApplicationCommandSubCommand, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";
import WebSocket from "ws";

export const stop = {
    data: new SlashCommandSubcommandBuilder()
        .setName('stop')
        .setNameLocalizations({
            'en-US': t('commands.music.subcommands.stop.name', 'en-US'),
            'pt-BR': t('commands.music.subcommands.stop.name', 'pt-BR')
        })
        .setDescription(t('commands.music.subcommands.stop.description', 'en-US'))
        .setDescriptionLocalizations({
            'en-US': t('commands.music.subcommands.stop.description', 'en-US'),
            'pt-BR': t('commands.music.subcommands.stop.description', 'pt-BR')
        }),
    usage: '/music stop',
    execute: async (interaction: ChatInputCommandInteraction, socket: WebSocket) => {
        const guild = interaction.guild;
        if(!guild) return;

        const locale = mapLocale(interaction.locale);

        await interaction.deferReply({ ephemeral: true });

        const waitForWsResponse = (interactionId: string): Promise<any> => {
            return new Promise((resolve, reject) => {
                const onMessage = (data: WebSocket.RawData) => {
                    try {
                        const parsedData = JSON.parse(data.toString());
        
                        if (parsedData.interactionId === interactionId && 
                            (parsedData.event === 'stop_success' || parsedData.event === 'stop_error')) {
                            socket.off('message', onMessage);
                            resolve(parsedData);
                        }
                    } catch (error) {
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
            const response = await waitForWsResponse(interaction.id);
            
            const embed = new Embed();

            if (response.event === 'stop_error') {
                embed.setColor('#FF0000');
                if (response.error === 'NO_QUEUE') {
                    embed.setDescription(t('player.errors.not_connected', locale));
                } else {
                    embed.setDescription(t('misc.error_ocurred', locale));
                }
            } else {
                embed.setColor(`#${colors.default_color}`);
                embed.setDescription(t('commands.music.subcommands.stop.response.stopped', locale));
            }

            await interaction.editReply({ embeds: [embed.build()] });
        } catch (error) {
            const embed = new Embed()
                .setColor('#FF0000')
                .setDescription(t('misc.error_ocurred', locale));

            await interaction.editReply({ embeds: [embed.build()] });
        }
    },
};