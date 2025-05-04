import { sockets } from "../../socket";

export const onAudioTrackAdd = async (queue: any, track: any) => {
  const data = queue.metadata;
  const ws = sockets.get(data.wsId);

  if (!ws) return;

  const message = {
    event: 'song_added',
    interactionId: data.interactionId,
    name: track.cleanTitle,
    url: track.url,
    duration: track.duration,
    thumbnail: track.thumbnail
  };

  ws.send(JSON.stringify(message));

  return;
}