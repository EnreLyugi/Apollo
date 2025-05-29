import { Client, GatewayIntentBits } from 'discord.js';
import * as clientEvents from './events';

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Conecta o bot assim que o módulo é importado
client.on('ready', () => {
    if (client.user) {
        console.log(`Cluster ${client.user.tag} iniciado no socket ${process.env.WS_PORT}`);
        client.user.setPresence({ status: 'invisible' });
    }
});

client.on('interactionCreate', clientEvents.onInteractionCreate);

// Login imediato
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Erro ao fazer login no bot:', error);
});

export default client;