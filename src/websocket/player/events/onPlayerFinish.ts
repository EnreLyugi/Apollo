import { t } from "../../../utils/localization";
import { QueueData } from "./types";
import { GuildQueue } from "discord-player";
import { EmbedBuilder } from "discord.js";

export const onPlayerFinish = async (queue: GuildQueue, track: any) => {
    const data = queue.metadata as QueueData;
    const { locale } = data;

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
}