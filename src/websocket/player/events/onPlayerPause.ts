import { QueueData } from "./types";
import { GuildQueue } from "discord-player";

export const onPlayerPause = async (queue: GuildQueue) => {
    const data = queue.metadata as QueueData;
    await data.playerMessage?.setState('paused', queue);
}
