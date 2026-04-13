import { getPlayer } from "../../player";
import { sockets } from "../../socket";

interface ShuffleData {
    guildId: string;
    interactionId?: string;
}

export const shuffle = async (data: ShuffleData, wsId: string) => {
    const { guildId, interactionId } = data;

    try {
        const player = getPlayer();
        const queue = player.nodes.get(guildId);

        if (!queue) {
            const ws = sockets.get(wsId);
            if (!ws) return;
            ws.send(JSON.stringify({ event: "shuffle_error", interactionId, error: "NO_QUEUE" }));
            return;
        }

        if (queue.tracks.size < 1) {
            const ws = sockets.get(wsId);
            if (!ws) return;
            ws.send(JSON.stringify({ event: "shuffle_error", interactionId, error: "EMPTY_QUEUE" }));
            return;
        }

        queue.toggleShuffle(false);

        const ws = sockets.get(wsId);
        if (!ws) return;
        ws.send(JSON.stringify({ event: "shuffle_success", interactionId }));
    } catch (e) {
        const ws = sockets.get(wsId);
        if (!ws) return;
        ws.send(JSON.stringify({ event: "shuffle_error", interactionId, error: String(e) }));
    }
};
