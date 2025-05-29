import { Client, PresenceUpdateStatus } from "discord.js";
import { guildService } from "../../services";
import cron from 'node-cron';
import { BirthdayController } from "../../controllers";


export const onReady = async (client: Client) => {
    console.log(`\x1b[34m%s\x1b[0m`, `\nBot started!\n\nUsers: ${client.users.cache.size} \nServers: ${client.guilds.cache.size}\n`);
    client.user?.setPresence({ activities: [{ name: `in ${client.guilds.cache.size} Servers` }], status: PresenceUpdateStatus.Online });

    (await client.guilds.fetch()).forEach(async guild => {
        await guildService.createGuildIfNotExists(guild.id);
    });

    cron.schedule('0 0 * * *', async () => {
        try {
            await BirthdayController.removeBirthdayRoles();
            await BirthdayController.notifyBirthdays();

            const user = client.users.resolve('1245127937259208808');
            if(user)
                await user.send('Rodou o cron agora!');
        } catch (err) {
            console.error('[CRON] Erro ao rodar cron diário:', err);
        }
    }, {
        timezone: "America/Sao_Paulo"
    });
}