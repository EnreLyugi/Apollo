import { WebSocket } from "ws";
import client from "../../client";

interface CheckAvailabilityData {
    guildId: string;
}

export const checkAvailability = async (data: CheckAvailabilityData, ws: WebSocket) => {
    const { guildId } = data;
    
    // Verifica se o client está pronto
    if (!client.isReady()) {
        ws.send(JSON.stringify({
            event: 'availability_response',
            available: false
        }));
        return;
    }

    // Verifica se o bot está no servidor
    const guild = client.guilds.cache.get(guildId);
    const available = !!guild;

    // Se o bot não estiver no servidor, tenta entrar (isso só funciona se o bot tiver sido convidado)
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