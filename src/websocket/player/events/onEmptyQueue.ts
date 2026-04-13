import { QueueData } from "./types";
import { t } from "../../../utils/localization";
import { colors } from "../../../config";
import { sockets } from "../../socket";
import { GuildQueue } from "discord-player";
import {
    ContainerBuilder,
    MessageFlags,
    TextDisplayBuilder,
} from "discord.js";

export const onEmptyQueue = async (queue: GuildQueue) => {
    const data = queue.metadata as QueueData;
    const { channelId, locale } = data;
    const ws = sockets.get(data.wsId);
    if (!ws) return;

    ws.send(JSON.stringify({
        event: 'queue_ended',
        guildId: queue.guild.id,
        channelId: data.channelId,
    }));

    const guild = queue.guild;
    const channel = guild.channels.resolve(channelId);
    if (!channel || !channel.isTextBased()) return;

    const container = new ContainerBuilder()
        .setAccentColor(parseInt(colors.default_color, 16))
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `### ${t('player.events.queue_ended.title', locale)}\n${t('player.events.queue_ended.description', locale)}`
            )
        );

    await channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    });
}
