import WebSocket from "ws";
import { sockets } from "../";
import { connectClient, disconnectClient, checkAvailability } from "../commands";
import { play } from "../commands/play";
import { stop } from "../commands/stop";
import { skip } from "../commands/skip";

export const onMessage = async (message: WebSocket.Data, wsId: string) => {
    const data = JSON.parse(message.toString());
    const ws = sockets.get(wsId);
    if(!ws) return;

    const command = data.command;

    switch (command) {
        case 'connect':
            connectClient(ws);
            break;
        case 'disconnect':
            disconnectClient(ws);
            break;
        case 'play':
            play(data, wsId);
            break;
        case 'stop':
            stop(data, wsId);
            break;
        case 'skip':
            skip(data, wsId);
            break;
        case 'check_availability':
            checkAvailability(data, ws);
            break;
        default:
            ws.send(JSON.stringify({ event: 'error', message: 'Comando desconhecido',  }));
            break;
    }
}