import { Embed } from "../../../models";
import { mapLocale } from "../../../utils/localization";
import client from "../../client";
import player from "../../player";

interface PlayData {
    guildId: string;
    channelId: string;
    userId: string;
    music: string;
    locale: string;
    interactionId?: string;
    interactionChannelId?: string;
}

export const play = async (data: PlayData, wsId: string) => {
    const { guildId, channelId, userId, music, interactionId, interactionChannelId } = data;

    const guild = client.guilds.cache.get(guildId);
    if(!guild) return;

    const locale = mapLocale(guild.preferredLocale);

    const channel = guild.channels.resolve(channelId);
    if(!channel) return;

    const user = client.users.cache.get(userId);

    const guildQueue = player.getQueue(guild.id);
    const queue = player.createQueue(guild.id, {
        data: {
            interactionId,
            channelId: interactionChannelId,
            locale,
            wsId
        }
    });

    await queue.join(channel);

    if (
        (music.includes("playlist") &&
            (music.includes("youtube.com") ||
            music.includes("youtu.be") ||
            music.includes("spotify.com"))) ||
        ((!music.includes("i=") || music.includes("playlist")) &&
        music.includes("apple.com"))
    ) {
        await queue
            .playlist(music, {
                maxSongs: 10000,
                requestedBy: user,
                channelId,
                interactionId
            })
            .catch(async (err) => {
                /*let embed = new Embed();
                let response = embed
                    .setColor("#FF0000")
                    .setAuthor({ name: t('misc.error_ocurred', locale) })
                    .setDescription(err.message);
                await interaction.editReply({ embeds: [ response.build() ] });*/
                if (!guildQueue) queue.stop();
            });
    } else {
        await queue.play(music, {
            requestedBy: user,
            channelId,
            interactionId
        })
        .catch((err) => {
            /*let response = new Embed()
                .setColor(`#FF0000`)
                .setAuthor({ name: t('misc.error_ocurred', locale) })
                .setDescription(err.message);
            interaction.editReply({ embeds: [ response.build() ] });*/
            if (!guildQueue) queue.stop();
        });
    }
}