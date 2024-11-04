import { Client, PresenceUpdateStatus } from "discord.js";
import { guildService } from "../../services";


export const onReady = async (client: Client) => {
    console.log(`\x1b[34m%s\x1b[0m`, `\nBot started!\n\nUsers: ${client.users.cache.size} \nServers: ${client.guilds.cache.size}\n`);
    client.user?.setPresence({ activities: [{ name: `in ${client.guilds.cache.size} Servers` }], status: PresenceUpdateStatus.Online });

    (await client.guilds.fetch()).forEach(async guild => {
        await guildService.createGuildIfNotExists(guild.id);
    });
}