import WebSocket, { WebSocketServer } from "ws";
import * as wsEvents from "./events"

const wsPort = process.env.WS_PORT ? Number(process.env.WS_PORT) : 0;
const wss = new WebSocketServer({ port: wsPort });

const sockets = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
    const wsId = generateUniqueId();
    sockets.set(wsId, ws);

    ws.on('message', (message) => { wsEvents.onMessage(message, wsId) });

    ws.on('close', () => {
        sockets.delete(wsId);
    });
});

process.on("SIGINT", ()  => {
    console.log(`\x1b[32m%s\x1b[0m`, "\nApplication shutdown with CTRL+C");
    process.exit(1);
});
  
process.on('uncaughtException', (err) => {
    console.error(`\x1b[32m%s\x1b[0m`, err);
});

process.on('unhandledRejection', (reason) => {
    console.error(`\x1b[32m%s\x1b[0m`, 'Rejected Promise:', reason);
});

function generateUniqueId() {
    return `ws-${Math.random().toString(36).substr(2, 9)}`;
}

export { sockets };