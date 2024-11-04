import { Queue, Song } from "@enrelyugi/discord-music-player";
import { QueueData } from "./types";
import { mapLocale, t } from "../../../utils/localization";
import Embed from "../../../models/embed";
import { updateEmbed } from "./utils";
import { unpausedButtons } from "../components";

export const onSongStart = async (queue: Queue, song: Song) => {
    const data = queue.data as QueueData;
    const { channelId, locale } = data;

    const guild = queue.guild;

    const channel = guild.channels.resolve(channelId);
    if(!channel) return;
    if(!channel.isTextBased()) return;

    const requestedBy = song.requestedBy;
    if (!requestedBy) return;

    const response = new Embed()
        .setColor("#00FF00")
        .setAuthor({ name: t('player.states.playing_now', locale) })
        .setThumbnail({ url: song.thumbnail })
        .setDescription(
            `[${song.name}](${song.url})\n${t('misc.duration', locale)} ${
            "`" + song.duration + "`"
            }\n\n${t('player.misc.requested_by')}: ${requestedBy}`
        )
        .addField(
            `\u200b`,
            `[${t('player.misc.invite_me', locale)}](https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=1099821344854&scope=bot)`
        );

    const responseMessage = await channel.send({
        embeds: [ response.build() ],
        components: [ unpausedButtons as any ],
    });

    data.currentMessage = responseMessage;
    data.song = song;

    queue.data = data;

    setTimeout(function () {
        updateEmbed(queue, song);
    }, 2000);
}