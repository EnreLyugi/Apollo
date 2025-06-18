import { Guild } from 'discord.js';
import client from '../client';
import Ban from '../models/ban';

class BanService {
  public async createBan(user_id: string, guild_id: string): Promise<Ban> {
    const guild = client.guilds.resolve(guild_id);
    
    if(guild) {
      const member = guild.members.resolve(user_id);

      if(member) {
        await member.ban();
      }
    }

    const hasBan = await this.getBan(user_id, guild_id);

    if(hasBan) {
      return hasBan;
    }

    return await Ban.create({ user_id, guild_id });
  }

  public async getBan(user_id: string, guild_id: string): Promise<Ban | null> {
    return await Ban.findOne({ where: { user_id, guild_id } });
  }

  public async removeBan(user_id: string, guild_id: string): Promise<void | null> {
    const banMember = await this.getBan(user_id, guild_id);

    if(banMember) {
      return await banMember.destroy();
    }

    return null;
  }
}

export default new BanService();
