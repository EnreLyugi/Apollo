import { QueueData } from "./types";
import { GuildQueue } from "discord-player";

export const onPlayerFinish = async (queue: GuildQueue, _track: any) => {
    const data = queue.metadata as QueueData;
    await data.playerMessage?.setState('finished');
}
