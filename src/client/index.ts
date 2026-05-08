import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import * as clientEvents from './events/';
import { retry } from '../utils/retry';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
    ],
});

// Initialize the invite cache: guildId -> (inviteCode -> uses)
export const invites = new Collection<string, Collection<string, number | null>>();

// create a delay with a promise
const wait = require("timers/promises").setTimeout;

//Client Events
client
.on('clientReady', async (client) => {
    clientEvents.onReady(client);
    
    // wait 1 second
    await wait(1000);

    // for each guild, fetch the invites and sync deleted color roles
    for (const guild of client.guilds.cache.values()) {
        try {
            const firstInvites = await guild.invites.fetch();
            invites.set(guild.id, new Collection(firstInvites.map(invite => [invite.code, invite.uses])));
        } catch {}
        await clientEvents.syncDeletedColorRoles(guild);
    }

}) //When client is ready
//.on('clientReady', clientEvents.onReady) //When client is ready
.on('interactionCreate', clientEvents.onInteractionCreate) //When a interaction is created
.on('messageCreate', clientEvents.onMessageCreate) //When a new message is received
.on('voiceStateUpdate', clientEvents.onVoiceStateUpdate) //When user's voice state changes
.on('guildMemberAdd', clientEvents.onGuildMemberAdd) //When a new member join's a server
.on('roleDelete', clientEvents.onRoleDelete) //When a role is deleted
.on('inviteCreate', clientEvents.onInviteCreate) //When a invite is created
.on('inviteDelete', clientEvents.onInviteDelete) //When a invite is deleted
.on('guildCreate', clientEvents.onGuildCreate) //When a guild is created
.on('guildDelete', clientEvents.onGuildDelete); //When a guild is deleted

retry(
    () => client.login(process.env.DISCORD_TOKEN),
    'ClientLogin',
).catch(err => {
    console.error('Failed to login after all retries:', err);
    process.exit(1);
});

export default client;
