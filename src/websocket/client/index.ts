import { Client, GatewayIntentBits } from 'discord.js';
import * as clientEvents from './events';

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Connect the bot as soon as the module is imported
client.on('ready', () => {
    if (client.user) {
        console.log(`Cluster ${client.user.tag} started on socket ${process.env.WS_PORT}`);
        client.user.setPresence({ status: 'invisible' });
    }
});

client.on('interactionCreate', clientEvents.onInteractionCreate);

// Immediate login
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Error logging in:', error);
});

export default client;