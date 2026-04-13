import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import * as clientEvents from './events/';

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

    // for each guild, fetch the invites and set the invite cache
    client.guilds.cache.forEach(async guild => {
        const firstInvites = await guild.invites.fetch();
        invites.set(guild.id, new Collection(firstInvites.map(invite => [invite.code, invite.uses])));
    });

    // One-off: give a role to every member. Remove after running. Uses delays to avoid API rate limits (429).
    /*const massRoleGuildId = '1304499241087143936';
    const massRoleId = '1489701802583523490';
    const guild = client.guilds.resolve(massRoleGuildId);
    if (guild) {
        const role = guild.roles.resolve(massRoleId);
        if (role) {
            const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
            try {
                await guild.members.fetch();
                let added = 0;
                let skipped = 0;
                let failed = 0;
                for (const member of guild.members.cache.values()) {
                    if (member.roles.cache.has(role.id)) {
                        skipped++;
                        continue;
                    }
                    try {
                        await member.roles.add(role);
                        added++;
                        console.log(`[mass-role] ${added}: ${member.user.username}`);
                    } catch (err) {
                        failed++;
                        console.error(`[mass-role] falhou ${member.user.username}:`, err);
                    }
                    await delay(500);
                }
                console.log(
                    `[mass-role] fim — adicionados: ${added}, já tinham: ${skipped}, falhas: ${failed}`,
                );
            } catch (e) {
                console.error('[mass-role] erro ao buscar membros:', e);
            }
        }
    }*/
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

client.login(process.env.DISCORD_TOKEN);

export default client;
