import { ApplicationCommandType, Client, Events, GatewayIntentBits, PermissionFlagsBits } from 'discord.js';
import * as clientEvents from './events/';
import { t } from '../utils/localization';
const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

//Client Events
client
.on('ready', clientEvents.onReady) //When client is ready
.on('interactionCreate', clientEvents.onInteractionCreate) //When a interaction is created
.on('messageCreate', clientEvents.onMessageCreate) //When a new message is received
.on('voiceStateUpdate', clientEvents.onVoiceStateUpdate) //When user's voice state changes
.on('guildMemberAdd', clientEvents.onGuildMemberAdd) //When a new member join's a server
.on('roleDelete', clientEvents.onRoleDelete); //When a role is deleted

client.login(process.env.DISCORD_TOKEN);

export default client;