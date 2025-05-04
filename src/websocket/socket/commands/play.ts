import { GuildBasedChannel, VoiceChannel } from "discord.js";
import { mapLocale } from "../../../utils/localization";
import client from "../../client";
import { useMainPlayer } from "discord-player";

interface PlayData {
    guildId: string;
    channelId: string;
    userId: string;
    music: string;
    locale: string;
    interactionId?: string;
    interactionChannelId?: string;
}

export const play = async (data: PlayData, wsId: string) => {
    const { guildId, channelId, userId, music, interactionId, interactionChannelId } = data;

    const guild = client.guilds.cache.get(guildId);
    if(!guild) return;

    const locale = mapLocale(guild.preferredLocale);

    const channel = guild.channels.resolve(channelId) as GuildBasedChannel;
    if (!channel) return;
    if(!(channel instanceof VoiceChannel)) return;

    const user = client.users.cache.get(userId);

    const mainPlayer = useMainPlayer();
    await mainPlayer.play(channel, music, {
        nodeOptions: {
            metadata: {
                channel: channel,
                requestedBy: user,
                interactionId,
                channelId: interactionChannelId,
                locale,
                wsId
            }
        }
    });
}