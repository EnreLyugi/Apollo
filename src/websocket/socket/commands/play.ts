import { GuildBasedChannel, User, userMention, VoiceChannel } from "discord.js";
import { mapLocale } from "../../../utils/localization";
import client from "../../client";
import { useMainPlayer } from "discord-player";
import { sockets } from "../../socket";

interface PlayData {
    guildId: string;
    channelId: string;
    userId: string;
    music: string;
    locale: string;
    interactionId?: string;
    interactionChannelId?: string;
    e?: string;
}

interface CustomUser extends User {
    wsId?: string;
    interactionId?: string;
  }

export const play = async (data: PlayData, wsId: string) => {
    const { guildId, channelId, userId, music, interactionId, interactionChannelId } = data;

    const guild = client.guilds.cache.get(guildId);
    if(!guild) return;

    const locale = mapLocale(guild.preferredLocale);

    const channel = guild.channels.resolve(channelId) as GuildBasedChannel;
    if (!channel) return;
    if(!(channel instanceof VoiceChannel)) return;

    const user = client.users.cache.get(userId) as CustomUser;
    if(!user) return;

    user.wsId = wsId;
    user.interactionId = interactionId;

    const mainPlayer = useMainPlayer();
    try{
        await mainPlayer.play(channel, music, {
            requestedBy: user,
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
        })
    } catch(e) {
        const ws = sockets.get(wsId);

        if (!ws) return;

        const message = {
            event: 'play_error',
            interactionId,
            e
        };

        ws.send(JSON.stringify(message));
    }
}