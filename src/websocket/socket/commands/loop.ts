import { QueueRepeatMode } from "discord-player";
import { getPlayer } from "../../player";
import { sockets } from "../../socket";

export interface LoopData {
    guildId: string;
    interactionId?: string;
    mode: "off" | "track" | "queue";
}

const modeToRepeat: Record<LoopData["mode"], QueueRepeatMode> = {
    off: QueueRepeatMode.OFF,
    track: QueueRepeatMode.TRACK,
    queue: QueueRepeatMode.QUEUE,
};

export const loop = async (data: LoopData, wsId: string) => {
    const { guildId, interactionId, mode } = data;

    try {
        const player = getPlayer();
        const queue = player.nodes.get(guildId);

        if (!queue) {
            const ws = sockets.get(wsId);
            if (!ws) return;
            ws.send(JSON.stringify({ event: "loop_error", interactionId, error: "NO_QUEUE" }));
            return;
        }

        const repeatMode = modeToRepeat[mode] ?? QueueRepeatMode.OFF;
        queue.setRepeatMode(repeatMode);

        const ws = sockets.get(wsId);
        if (!ws) return;
        ws.send(JSON.stringify({ event: "loop_success", interactionId, mode }));
    } catch (e) {
        const ws = sockets.get(wsId);
        if (!ws) return;
        ws.send(JSON.stringify({ event: "loop_error", interactionId, error: String(e) }));
    }
};
