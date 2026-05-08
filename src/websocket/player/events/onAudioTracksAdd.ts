import { sockets } from "../../socket";
import { GuildQueue } from "discord-player";

export const onAudioTracksAdd = async (queue: GuildQueue, tracks: Array<any>) => {
    const { wsId, interactionId } = tracks[0].requestedBy;

    const ws = sockets.get(wsId);
    if (!ws) return;

    const playlist = tracks[0].playlist;

    const message = {
      event: 'playlist_added',
      interactionId: interactionId,
      name: playlist.title,
      url: playlist.url,
      thumbnail: playlist.thumbnail,
      length: tracks.length
    };

    ws.send(JSON.stringify(message));

    return
}