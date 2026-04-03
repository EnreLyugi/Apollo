import WebSocket from "ws";
import { initDiscordClient } from "../utils";

export const connectClient = async (ws: WebSocket) => {
    const status = await initDiscordClient();
    ws.send(JSON.stringify({ event: 'connected', status: status }));
}