import { t } from "../../../utils/localization";
import { QueueData } from "./types";
import Embed from "../../../models/embed";
import { updateEmbed } from "./utils";
import { unpausedButtons } from "../components";
import { GuildQueue } from "discord-player";

export const onPlayerStart = async (queue: GuildQueue, track: any) => {
    const data = queue.metadata as QueueData;
    const { channelId, locale } = data;

    const guild = queue.guild;

    const channel = guild.channels.resolve(channelId);
    if(!channel) return;
    if(!channel.isTextBased()) return;

    const response = new Embed()
        .setColor("#00FF00")
        .setAuthor({ name: t('player.states.playing_now', locale) })
        .setThumbnail({ url: track.thumbnail })
        .setDescription(
            `[${track.title}](${track.url})\n${t('misc.duration', locale)} ${
            "`" + track.duration + "`"
            }\n\n${t('player.misc.requested_by', locale)}: ${track.requestedBy}`
        )
        .addField(
            `\u200b`,
            `[${t('player.misc.invite_me', locale)}](https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=1099821344854&scope=bot)`
        );

    const responseMessage = await channel.send({
        embeds: [ response.build() ],
        components: [ unpausedButtons as any ],
    });

    track.currentMessage = responseMessage;
    data.currentMessage = responseMessage;
    data.track = track;

    queue.metadata = data;

    setTimeout(function () {
        updateEmbed(queue, track);
    }, 2000);
}