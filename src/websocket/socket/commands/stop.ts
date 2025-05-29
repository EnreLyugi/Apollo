import { getPlayer } from "../../player";
import { sockets } from "../../socket";
import { HandleError } from "../../player/events/utils/updateEmbed";
import { Message } from "discord.js";

interface StopData {
    guildId: string;
    interactionId?: string;
}

interface QueueMetadata {
    currentMessage?: Message;
    locale?: string;
    [key: string]: any;
}

export const stop = async (data: StopData, wsId: string) => {
    const { guildId, interactionId } = data;

    try {
        const player = getPlayer();
        const queue = player.nodes.get(guildId);

        if (!queue) {
            const ws = sockets.get(wsId);
            if (!ws) return;

            const message = {
                event: 'stop_error',
                interactionId,
                error: 'NO_QUEUE'
            };

            ws.send(JSON.stringify(message));
            return;
        }

        const metadata = queue.metadata as QueueMetadata;
        if (metadata?.currentMessage && queue.currentTrack) {
            await HandleError(queue.currentTrack, null, metadata.locale, metadata);
        }

        queue.delete();

        const ws = sockets.get(wsId);
        if (!ws) return;

        const message = {
            event: 'stop_success',
            interactionId
        };

        ws.send(JSON.stringify(message));
    } catch(e) {
        const ws = sockets.get(wsId);
        if (!ws) return;

        const message = {
            event: 'stop_error',
            interactionId,
            error: e
        };

        ws.send(JSON.stringify(message));
    }
} 