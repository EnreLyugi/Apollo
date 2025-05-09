import { t } from "../../../utils/localization";
import { QueueData } from "./types";
import { GuildQueue } from "discord-player";
import { pausedButtons } from "../components";
import { EmbedBuilder } from "discord.js";

export const onPlayerPause = async (queue: GuildQueue) => {
    const data = queue.metadata as QueueData;
    const { locale } = data;

    const track = queue.currentTrack as any;
    if(!track) return;

    const oldEmbed = data.currentMessage.embeds[0];
    
    const embed = EmbedBuilder.from(oldEmbed)
        .setColor("#FF0000")
        .setAuthor({ name: t('player.states.song_paused', locale) });

    const message = await data.currentMessage.edit({
        embeds: [ embed ],
        components: [ pausedButtons as any ],
    });

    data.currentMessage = message;
}