import { Queue, Song } from "@enrelyugi/discord-music-player";
import { QueueData } from "./types";
import { sockets } from "../../socket";

export const onSongAdd = async (queue: Queue, song: Song) => {
    const data = queue.data as QueueData;
    const ws = sockets.get(data.wsId);

    if (!ws) return;

    const message = {
      event: 'song_added',
      interactionId: song.interactionId,
      name: song.name,
      url: song.url,
      duration: song.duration,
      thumbnail: song.thumbnail
    };

    ws.send(JSON.stringify(message));

    return;
}