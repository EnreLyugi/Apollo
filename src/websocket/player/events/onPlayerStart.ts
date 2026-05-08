import { QueueData } from "./types";
import { PlayerMessage } from "../classes";
import { GuildQueue } from "discord-player";
import { syncMusicPresence } from "../utils/syncMusicPresence";

export const onPlayerStart = async (queue: GuildQueue, track: any) => {
    const data = queue.metadata as QueueData;
    const { channelId, locale } = data;

    const guild = queue.guild;
    const channel = guild.channels.resolve(channelId);
    if (!channel || !channel.isTextBased()) return;

    const pm = new PlayerMessage(track, locale);
    await pm.send(channel);

    data.currentMessage = pm.message!;
    data.playerMessage = pm;
    data.track = track;
    queue.metadata = data;

    pm.startAutoUpdate(queue, track.url);

    syncMusicPresence();
}
