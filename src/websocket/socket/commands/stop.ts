import { getPlayer } from "../../player";
import { sockets } from "../../socket";
import { QueueData } from "../../player/events/types";

interface StopData {
    guildId: string;
    interactionId?: string;
}

export const stop = async (data: StopData, wsId: string) => {
    const { guildId, interactionId } = data;

    try {
        const player = getPlayer();
        const queue = player.nodes.get(guildId);

        if (!queue) {
            const ws = sockets.get(wsId);
            if (!ws) return;
            ws.send(JSON.stringify({ event: 'stop_error', interactionId, error: 'NO_QUEUE' }));
            return;
        }

        const metadata = queue.metadata as QueueData;
        if (metadata?.playerMessage) {
            await metadata.playerMessage.setState('finished');
        }

        queue.delete();

        const ws = sockets.get(wsId);
        if (!ws) return;
        ws.send(JSON.stringify({ event: 'stop_success', interactionId }));
    } catch (e) {
        const ws = sockets.get(wsId);
        if (!ws) return;
        ws.send(JSON.stringify({ event: 'stop_error', interactionId, error: e }));
    }
}
