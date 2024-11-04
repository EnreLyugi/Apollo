import { Queue, Playlist } from "@enrelyugi/discord-music-player";
import { QueueData } from "./types/QueueData";
import { sockets } from "../../socket";

export const onPlaylistAdd = async (queue: Queue, playlist: Playlist) => {
    const data = queue.data as QueueData;
    const ws = sockets.get(data.wsId);

    if (!ws) return;

    const message = {
      event: 'playlist_added',
      interactionId: playlist.interactionId,
      name: playlist.name,
      url: playlist.url,
      thumbnail: playlist.songs[0].thumbnail,
      length: playlist.songs.length
    };

    ws.send(JSON.stringify(message));

    return
}