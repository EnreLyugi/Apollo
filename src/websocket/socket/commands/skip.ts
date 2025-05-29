import { getPlayer } from "../../player";
import { sockets } from "../../socket";

interface SkipData {
    guildId: string;
    interactionId?: string;
}

export const skip = async (data: SkipData, wsId: string) => {
    const { guildId, interactionId } = data;

    try {
        const player = getPlayer();
        const queue = player.nodes.get(guildId);

        if (!queue) {
            const ws = sockets.get(wsId);
            if (!ws) return;

            const message = {
                event: 'skip_error',
                interactionId,
                error: 'NO_QUEUE'
            };

            ws.send(JSON.stringify(message));
            return;
        }

        queue.node.skip();

        const ws = sockets.get(wsId);
        if (!ws) return;

        const message = {
            event: 'skip_success',
            interactionId
        };

        ws.send(JSON.stringify(message));
    } catch(e) {
        const ws = sockets.get(wsId);
        if (!ws) return;

        const message = {
            event: 'skip_error',
            interactionId,
            error: e
        };

        ws.send(JSON.stringify(message));
    }
} 