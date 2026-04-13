import { QueueData } from "./types";
import { GuildQueue } from "discord-player";
import { syncMusicPresence } from "../utils/syncMusicPresence";

export const onPlayerResume = async (queue: GuildQueue) => {
    const data = queue.metadata as QueueData;
    await data.playerMessage?.setState('playing', queue);
    syncMusicPresence();
}
