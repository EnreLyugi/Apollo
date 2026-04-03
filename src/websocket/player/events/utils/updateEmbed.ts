import { mapLocale, t } from "../../../../utils/localization";
import { progressBarOptions } from "../../../../config";
import { pausedButtons, unpausedButtons } from "../../components";
import { EmbedBuilder } from "discord.js";

export const updateEmbed = async function (queue: any, track: any) {
    const data = queue.metadata;
    const { locale } = data

    const update = setInterval(async function () {
        try {
            const progressBar = queue.node.createProgressBar({
                length: progressBarOptions.size
            });

            /* ProgressBarOptions
                indicator	string
                leftChar	string
                length	number
                queue	boolean
                rightChar	string
                separator	string
                timecodes	boolean
            */

            const oldEmbed = data.currentMessage.embeds[0];

            const embed = EmbedBuilder.from(oldEmbed)
                .setDescription(
                    `[${track.title}](${track.url})\n${progressBar}\n\n\n${t('player.misc.requested_by', locale)}: ${track.requestedBy}`
                );

            const message = await data.currentMessage.edit({
                embeds: [ embed ],
                components: [queue.node.isPaused() ? pausedButtons as any : unpausedButtons],
            }).catch((e: any) => {
                console.error(e);
            });

            data.currentMessage = message;

            if(queue.currentTrack.url != data.track.url || (!queue.node.isPlaying() && !queue.node.isPaused)) {
                HandleError(track, update, locale, data)
            }
        } catch (e) {
            HandleError(track, update, locale, data);
        }
    }, 2000);
}

export const HandleError = async function (track: any, update: NodeJS.Timeout | null, localization: string | undefined, data: any) {
    const locale = mapLocale(localization ?? '')

    const oldEmbed = data.currentMessage.embeds[0];
            
    const embed = EmbedBuilder.from(oldEmbed)
        .setColor("#FF0000")
        .setAuthor({ name: t('player.states.song_finished', locale) })
        .setDescription(`[${track.title}](${track.url})\n\n${t('player.misc.requested_by', locale)} ${track.requestedBy}`);

    const message = await data.currentMessage.edit({
        embeds: [ embed ],
        components: [],
    });

    data.currentMessage = message;  
    
    if (update) {
        clearInterval(update);
    }
};