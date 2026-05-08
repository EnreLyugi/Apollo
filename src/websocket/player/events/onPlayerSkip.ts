import { GuildQueue } from "discord-player";
import { QueueData } from "./types";
import { t } from "../../../utils/localization";
import {
    ContainerBuilder,
    MessageFlags,
    TextDisplayBuilder,
} from "discord.js";

export const onPlayerSkip = async (queue: GuildQueue, track: any) => {
    const data = queue.metadata as QueueData;
    if (!data) return;

    if (data.playerMessage) {
        await data.playerMessage.setState('finished');
    }

    const { channelId, locale } = data;
    const guild = queue.guild;
    const channel = guild.channels.resolve(channelId);
    if (!channel || !channel.isTextBased()) return;

    const container = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `### ${t('player.errors.no_results', locale)}\n${track?.title ?? ''}`
            )
        );

    await channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    }).catch(() => {});
};
