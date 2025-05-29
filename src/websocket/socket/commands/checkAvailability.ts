import { WebSocket } from "ws";
import client from "../../client";

interface CheckAvailabilityData {
    guildId: string;
}

export const checkAvailability = async (data: CheckAvailabilityData, ws: WebSocket) => {
    const { guildId } = data;
    
    // Check if client is ready
    if (!client.isReady()) {
        ws.send(JSON.stringify({
            event: 'availability_response',
            available: false
        }));
        return;
    }

    // Check if bot is in the guild
    const guild = client.guilds.cache.get(guildId);
    const available = !!guild;

    // If bot is not in the guild, try to join (this only works if the bot has been invited)
    if (!available) {
        ws.send(JSON.stringify({
            event: 'availability_response',
            available: false
        }));
        return;
    }

    ws.send(JSON.stringify({
        event: 'availability_response',
        available
    }));
}; 