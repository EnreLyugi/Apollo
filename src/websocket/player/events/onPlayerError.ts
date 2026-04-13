import { GuildQueue } from "discord-player";
import { QueueData } from "./types";
import { t } from "../../../utils/localization";
import { colors } from "../../../config";
import {
    ContainerBuilder,
    MessageFlags,
    TextDisplayBuilder,
} from "discord.js";

export const onPlayerError = async (queue: GuildQueue, error: any) => {
    const data = queue.metadata as QueueData;
    if (!data) return;

    if (data.playerMessage) {
        await data.playerMessage.setState('finished');
    }

    const { channelId, locale } = data;
    const guild = queue.guild;
    const channel = guild.channels.resolve(channelId);
    if (!channel || !channel.isTextBased()) return;

    const errCode = error?.code ?? error?.name ?? '';
    const msgKey = errCode === 'ERR_NO_RESULT'
        ? 'player.errors.no_results'
        : 'misc.error_ocurred';

    const container = new ContainerBuilder()
        .setAccentColor(0xFF0000)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `### ${t('misc.error_ocurred', locale)}\n${t(msgKey, locale)}`
            )
        );

    await channel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    }).catch(() => {});
};
