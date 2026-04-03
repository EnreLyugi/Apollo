"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invites = void 0;
const discord_js_1 = require("discord.js");
const clientEvents = __importStar(require("./events/"));
const client = new discord_js_1.Client({ intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildMembers
    ]
});
// Initialize the invite cache: guildId -> (inviteCode -> uses)
exports.invites = new discord_js_1.Collection();
// create a delay with a promise
const wait = require("timers/promises").setTimeout;
//Client Events
client
    .on('ready', (client) => __awaiter(void 0, void 0, void 0, function* () {
    clientEvents.onReady(client);
    // wait 1 second
    yield wait(1000);
    // for each guild, fetch the invites and set the invite cache
    client.guilds.cache.forEach((guild) => __awaiter(void 0, void 0, void 0, function* () {
        const firstInvites = yield guild.invites.fetch();
        exports.invites.set(guild.id, new discord_js_1.Collection(firstInvites.map(invite => [invite.code, invite.uses])));
    }));
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
})) //When client is ready
    //.on('ready', clientEvents.onReady) //When client is ready
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
exports.default = client;
