import WebSocket, { WebSocketServer } from "ws";
import * as wsEvents from "./events"

const wsPort = process.env.WS_PORT ? Number(process.env.WS_PORT) : 0;
const wss = new WebSocketServer({ port: wsPort }, () => {
    console.log(`Websocket rodando na porta ${wsPort}`);
});

const sockets = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
    const wsId = generateUniqueId();
    sockets.set(wsId, ws);

    ws.on('message', (message) => { wsEvents.onMessage(message, wsId) });

    ws.on('close', () => {
        sockets.delete(wsId);
    });
});

function generateUniqueId() {
    return `ws-${Math.random().toString(36).substr(2, 9)}`;
}

export { sockets };