import birthdayService from '../services/birthdayService';
import client from '../client';
import { guildService } from '../services';
import { format, mapLocale, t } from '../utils/localization';
import { Embed } from '../models';
import { colors } from '../config';

class BirthdayController {
  public async notifyBirthdays(): Promise<void> {
    const birthdays = await birthdayService.getBirthdays();

    if(birthdays && birthdays.length > 0) {
      for(const birthday of birthdays) {
        const user = await client.users.fetch(birthday.user_id);
        if(!user) continue;

        for(const guild of client.guilds.cache.values()) {
          try {
            const member = await guild.members.fetch(birthday.user_id);
            if(!member) continue;

            const guildData = await guildService.getGuildById(guild.id);
            if(!guildData) continue;

            if(guildData.birthday_channel) {
              const channel = guild.channels.resolve(guildData.birthday_channel);
              if(!channel) continue;
              if(!channel.isTextBased()) continue;

              const locale = mapLocale(guild.preferredLocale);

              const embed = new Embed()
                    .setColor(`#${colors.default_color}`)
                    .setTitle(t('client.birthday.title', locale))
                    .setTimestamp(new Date())
                    .setDescription(format(t(`client.birthday.body`, locale), {
                      "member": `${member}`
                    }))
                    .setFooter({
                      text: format(t(`client.birthday.footer`, locale), {
                        "guildName": guild.name
                      })
                    })
                    .setImage({ url: "https://pa1.aminoapps.com/6479/9747b7158d4a21faaaebabc9e3a88880bb1f45a7_hq.gif" });
              
              await channel.send({ content: `@everyone`, embeds: [ embed.build() ] });
            }

            if(guildData.birthday_role) {
              const role = guild.roles.resolve(guildData.birthday_role);
              if(!role) continue;

              await member.roles.add(role);
            }
          } catch(e: any) {
            console.error(e);
            continue;
          }
        }
      }
    }
  }

  public async removeBirthdayRoles(): Promise<void> {
    for(const guild of client.guilds.cache.values()) {
      try {
        const guildData = await guildService.getGuildById(guild.id);
        if(!guildData || !guildData.birthday_role) continue;

        const role = guild.roles.resolve(guildData.birthday_role);
        if (!role) continue;

        const membersWithRole = role.members;

        for (const member of membersWithRole.values()) {
          try {
            await member.roles.remove(role);
          } catch (err) {
            console.error(err);
            continue;
          }
        }
      } catch (err) {
        console.error(err);
        continue;
      }
    }
  }
}

export default new BirthdayController();
