import { QueueData } from "./types/QueueData";
import { sockets } from "../../socket";
import { GuildQueue } from "discord-player";

export const onAudioTracksAdd = async (queue: GuildQueue, tracks: Array<any>) => {
    const data = queue.metadata as QueueData;
    const ws = sockets.get(data.wsId);

    if (!ws) return;

    const firstTrack = tracks[0];

    const message = {
      event: 'playlist_added',
      interactionId: firstTrack.interactionId,
      name: firstTrack.cleanTitle,
      url: firstTrack.url,
      thumbnail: firstTrack.thumbnail,
      length: tracks.length
    };

    ws.send(JSON.stringify(message));

    return
}