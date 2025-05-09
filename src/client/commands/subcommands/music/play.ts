import {
    ChatInputCommandInteraction,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";

interface MusicResponse {
    event: string;
    name: string;
    url: string;
    duration: string;
    thumbnail: string;
    length: number;
    e: string;
}

export const play = {
    data: new SlashCommandSubcommandBuilder()
        .setName('play')
        .setNameLocalizations({
            'en-US': t('commands.music.subcommands.play.name', 'en-US'),
            'pt-BR': t('commands.music.subcommands.play.name', 'pt-BR')
        })
        .setDescription(t('commands.music.subcommands.play.description', 'en-US'))
        .setDescriptionLocalizations({
            'en-US': t('commands.music.subcommands.play.description', 'en-US'),
            'pt-BR': t('commands.music.subcommands.play.description', 'pt-BR')
        })
        .addStringOption(new SlashCommandStringOption()
            .setName('music')
            .setNameLocalizations({
                'en-US': t('commands.music.subcommands.play.options.music.name', 'en-US'),
                'pt-BR': t('commands.music.subcommands.play.options.music.name', 'pt-BR')
            })
            .setDescription(t('commands.music.subcommands.play.options.music.description', 'en-US'))
            .setDescriptionLocalizations({
                'en-US': t('commands.music.subcommands.play.options.music.description', 'en-US'),
                'pt-BR': t('commands.music.subcommands.play.options.music.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    usage: '/music play',
    execute: async (interaction: ChatInputCommandInteraction, socket: WebSocket) => {
        const music = interaction.options.getString('music');
        if(!music) return

        const guild = interaction.guild;
        if(!guild) return;

        const member = guild.members.resolve(interaction.user.id);
        if(!member) return;

        const channel = member.voice.channel;
        if(!channel) return;

        const interactionChannel = interaction.channel;

        await interaction.deferReply({ ephemeral: true });

        const waitForWsResponse = (interactionId: string): Promise<MusicResponse> => {
            return new Promise((resolve, reject) => {
                const onMessage = (event: MessageEvent) => {
                    try {
                        const data = JSON.parse(event.data);
        
                        if (data.interactionId === interactionId) {
                            socket.removeEventListener('message', onMessage);
                            resolve(data as MusicResponse);
                        }
                    } catch (error) {
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

        const locale = mapLocale(interaction.locale);

        socket.send(JSON.stringify({
            command: "play",
            guildId: guild.id,
            channelId: channel.id,
            userId: member.id,
            music,
            interactionId: interaction.id,
            interactionChannelId: interactionChannel?.id
        }));

        try {
            const responseData = await waitForWsResponse(interaction.id);

            console.log(responseData)

            const response = new Embed()
                .setColor(`#${colors.default_color}`)
                .setAuthor({ name: t(`player.events.${responseData.event}`, locale) })
                .setThumbnail({ url: responseData.thumbnail })

            if (responseData.event == 'song_added') {
                response.setDescription(
                    `[${responseData.name}](${responseData.url})
                    ${t('misc.duration', locale)}: \`${responseData.duration}\``
                );
            } else if (responseData.event == 'playlist_added') {
                response.setDescription(
                        `[${responseData.name}](${responseData.url})
                        
                        **${responseData.length}** ${t('misc.songs', locale)}`
                    );
            } else if (responseData.event == 'play_error') {
                response.setColor(`#FF0000`)
                response.setDescription(responseData.e)
            }

            await interaction.editReply({ embeds: [ response.build() ] });
        } catch (error) {
            console.error('Erro ao aguardar resposta do WebSocket:', error);
            await interaction.editReply('Ocorreu um erro ao tentar tocar a música.');
        }
    },
};