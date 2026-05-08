import { WebSocket } from "ws";
import client from "../../client"
import { disconnectDiscordClient } from "../utils";
import { t } from "../../../utils/localization";

export const disconnectClient = async (ws: WebSocket) => {
    await disconnectDiscordClient();
    ws.send(JSON.stringify({ 
        event: 'disconnected', 
        status: !client.isReady() ? t('websocket.bot_disconnected', 'en-US') : t('websocket.disconnect_error', 'en-US')
    }));
}