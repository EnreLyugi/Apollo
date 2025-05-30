import { t } from "../../../utils/localization";
import { QueueData } from "./types";
import { GuildQueue } from "discord-player";
import { unpausedButtons } from "../components";
import { EmbedBuilder } from "discord.js";

export const onPlayerResume = async (queue: GuildQueue) => {
    const data = queue.metadata as QueueData;
    const { locale } = data;

    const track = queue.currentTrack as any;
    if(!track) return;

    const oldEmbed = data.currentMessage.embeds[0];
        
    const embed = EmbedBuilder.from(oldEmbed)
        .setColor("#00FF00")
        .setAuthor({ name: t('player.states.playing_now', locale) });

    const message = await data.currentMessage.edit({
        embeds: [ embed ],
        components: [ unpausedButtons as any ],
    });

    data.currentMessage = message;
}