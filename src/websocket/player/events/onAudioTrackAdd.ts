import { sockets } from "../../socket";

export const onAudioTrackAdd = async (queue: any, track: any) => {
  if (!('wsId' in track.requestedBy) || !('interactionId' in track.requestedBy)) return;
  const ws = sockets.get(track.requestedBy.wsId);

  if (!ws) return;

  const message = {
    event: 'song_added',
    interactionId: track.requestedBy.interactionId,
    name: track.cleanTitle,
    url: track.url,
    duration: track.duration,
    thumbnail: track.thumbnail
  };

  ws.send(JSON.stringify(message));

  return;
}