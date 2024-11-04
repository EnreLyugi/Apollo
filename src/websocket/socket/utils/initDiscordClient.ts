import client from "../../client";
import * as clientEvents from "../../client/events"

export const initDiscordClient = async () => {
    return new Promise((resolve, reject) => {
        if (!client.isReady()) {
            client.once('ready', () => {
                resolve('Bot conectado');
            });

            client.on('interactionCreate', clientEvents.onInteractionCreate)

            client.login(process.env.DISCORD_TOKEN).catch((error) => {
                console.error('Erro ao fazer login no bot:', error);
                reject('Erro ao conectar o bot');
            });
        } else {
            console.log('Bot já está conectado.');
            client.user?.setPresence({ activities: [], status: 'online' });
            resolve('Bot já está conectado.');
        }
    });
}