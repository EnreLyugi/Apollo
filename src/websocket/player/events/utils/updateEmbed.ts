import { Queue, Song } from "@enrelyugi/discord-music-player";
import { QueueData } from "../types";
import { mapLocale, t } from "../../../../utils/localization";
import { progressBarOptions } from "../../../../config";
import Embed from "../../../../models/embed";
import { pausedButtons, unpausedButtons } from "../../components";

export const updateEmbed = async function (queue: Queue, song: Song) {
    const data = queue.data as QueueData;
    const { locale } = data

    const update = setInterval(async function () {
        try {
            const progressBarBuild = queue.createProgressBar({
                size: progressBarOptions.size,
                block: progressBarOptions.block,
                arrow: progressBarOptions.arrow
            })
            const progressBar =  progressBarBuild.bar.replace(/ /g, progressBarOptions.space)

            const requestedBy = song.requestedBy;
            if (!requestedBy) return;

            const response = new Embed()
                .setColor(queue.paused ? '#FF0000' : '#00FF00')
                .setAuthor({
                    name: queue.paused ? t('player.states.song_paused', locale) : t('player.states.playing_now', locale)
                })
                .setThumbnail({ url: song.thumbnail })
                .setDescription(
                    `[${song.name}](${song.url})\n${progressBar}\n                     ${progressBarBuild.times}\n\n${t('player.misc.requested_by', locale)}: ${requestedBy}`
                )
                .addField(
                    `\u200b`,
                    `[${t('player.misc.invite_me', locale)}](https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=1099821344854&scope=bot)`
                )

            data.currentMessage.edit({
                embeds: [ response.build() ],
                components: [queue.paused ? pausedButtons as any : unpausedButtons],
            }).catch(e => {})

            if(queue.nowPlaying != data.song || !queue.isPlaying) {
                HandleError(song, update, locale, data)
            }
        } catch (e) {
            HandleError(song, update, locale, data);
        }
    }, 2000);
}

const HandleError = async function (song: Song, update: NodeJS.Timeout, localization: string | undefined, data: QueueData) {
    const locale = mapLocale(localization ?? '')

    const requestedBy = song.requestedBy;
    if (!requestedBy) return;

    const response = new Embed()
        .setColor('#FF0000')
        .setAuthor({ name: t('player.states.song_finished', locale) })
        .setThumbnail({ url: song.thumbnail })
        .setDescription(`[${song.name}](${song.url})\n\n${t('player.misc.requested_by', locale)} ${requestedBy}`)
        .addField(
            `\u200b`,
            `[${t('player.misc.invite_me', locale)}](https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=1099821344854&scope=bot)`
        );
    
    data.currentMessage.edit({
        embeds: [ response.build() ],
        components: []
    })    
    
    clearInterval(update);
};