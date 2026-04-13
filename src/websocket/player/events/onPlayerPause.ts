import { QueueData } from "./types";
import { GuildQueue } from "discord-player";
import { syncMusicPresence } from "../utils/syncMusicPresence";

export const onPlayerPause = async (queue: GuildQueue) => {
    const data = queue.metadata as QueueData;
    await data.playerMessage?.setState('paused', queue);
    syncMusicPresence();
}
