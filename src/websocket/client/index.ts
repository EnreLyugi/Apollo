import { Client, GatewayIntentBits } from 'discord.js';
import * as clientEvents from './events';
import { retry } from '../../utils/retry';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    rest: {
        timeout: 60_000,
    },
});

client.on('clientReady', () => {
    if (client.user) {
        console.log(`Cluster ${client.user.tag} started on socket ${process.env.WS_PORT}`);
        client.user.setPresence({ status: 'invisible' });
    }
});

client.on('interactionCreate', clientEvents.onInteractionCreate);

retry(
    () => client.login(process.env.DISCORD_TOKEN),
    'WebSocketClientLogin',
).catch(err => {
    console.error('Error logging in after all retries:', err);
    process.exit(1);
});

export default client;
