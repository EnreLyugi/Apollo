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

export const onDisconnect = async (queue: GuildQueue) => {
    const data = queue.metadata as QueueData;
    const { channelId, locale } = data;
    const ws = sockets.get(data.wsId);
    if (!ws) return;

    ws.send(JSON.stringify({
        event: 'client_disconnected',
        guildId: queue.guild.id,
        channelId: data.channelId,
        playingChannel: data.channel.id,
    }));

    const guild = queue.guild;
    const channel = guild.channels.resolve(channelId);
    if (!channel || !channel.isTextBased()) return;

    const container = new ContainerBuilder()
        .setAccentColor(parseInt(colors.default_color, 16))
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `### ${t('player.events.client_disconnect.title', locale)}\n${t('player.events.client_disconnect.description', locale)}`
            )
        );

    await channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    });
}
