import { where } from 'sequelize';
import Guild from '../models/guild';

class GuildService {
  public async createGuild(id: string): Promise<Guild> {
    return await Guild.create({ id });
  }

  public async getGuildById(id: string): Promise<Guild | null> {
    return await Guild.findByPk(id);
  }

  public async setRole(roleType: string, guild_id: string, role_id: string): Promise<Guild> {
    try {
      var guild = await this.getGuildById(guild_id);

      if(!guild) {
        guild = await this.createGuild(guild_id);
      }

      switch (roleType) {
        case 'welcome_role':
          guild.welcome_role = role_id;
          break;
        default:
          throw new Error('Invalid Role Type')
      }

      await guild.save();
      return guild;
    } catch(e) {
      throw new Error('An Error Ocurred on setting welcome role!')
    }
  }

  public async getRole(roleType: string, guild_id: string): Promise<string | null> {
    const guild = await this.getGuildById(guild_id);

    if(!guild) return null;

    return guild.welcome_role;
  }

  public async setChannel(channelType: string, guild_id: string, channel_id: string): Promise<Guild> {
    try {
      var guild = await this.getGuildById(guild_id);

      if(!guild) {
        guild = await this.createGuild(guild_id);
      }

      switch (channelType) {
        case 'welcome_channel':
          guild.welcome_channel = channel_id;
          break;
        case 'voice_activity_log_channel':
          guild.voice_activity_log_channel = channel_id;
          break;
        default:
          throw new Error('Invalid Channel Type')
      }

      await guild.save();
      return guild;
    } catch(e) {
      throw new Error('An Error Ocurred on setting welcome channel!');
    }
  }

  public async createGuildIfNotExists(id: string): Promise<Guild> {
    try {
      const guild = await this.getGuildById(id);
      if(!guild) {
        return await this.createGuild(id);
      }
      return guild;
    } catch(e) {
      throw new Error('An Error Ocurred on creating a new guild!');
    }
  }
}

export default new GuildService();
