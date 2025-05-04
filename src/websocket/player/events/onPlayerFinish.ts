import { t } from "../../../utils/localization";
import { QueueData } from "./types";
import { GuildQueue } from "discord-player";
import { EmbedBuilder } from "discord.js";

export const onPlayerFinish = async (queue: GuildQueue, track: any) => {
    const data = queue.metadata as QueueData;
    const { locale } = data;

    const requestedBy = data.requestedBy;
    if (!requestedBy) return;

    const oldEmbed = data.currentMessage.embeds[0];
            
    const newEmbed = EmbedBuilder.from(oldEmbed)
        .setColor("#FF0000")
        .setAuthor({ name: t('player.states.song_finished', locale) })
        .setDescription(`[${track.cleanTitle}](${track.url})\n\n${t('player.misc.requested_by', locale)} ${requestedBy}`);

    const message = await data.currentMessage.edit({
        embeds: [ newEmbed ],
        components: [],
    });

    data.currentMessage = message;
}