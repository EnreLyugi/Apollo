import { WebSocket } from "ws";
import client from "../../client"
import { disconnectDiscordClient } from "../utils";

export const disconnectClient = async (ws: WebSocket) => {
    await disconnectDiscordClient();
    ws.send(JSON.stringify({ event: 'disconnected', status: !client.isReady() ? 'Bot desconectado' : 'erro ao desconectar' }));
}