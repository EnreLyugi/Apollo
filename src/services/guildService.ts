import { UniqueConstraintError } from 'sequelize';
import Guild from '../models/guild';
import { normalizeInviteCode } from '../utils/inviteCode';

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
        case 'birthday_role':
          guild.birthday_role = role_id;
          break;
        case 'ticket_role':
          guild.ticket_role = role_id;
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

    switch (roleType) {
      case 'welcome_role':
        return guild.welcome_role;
      case 'birthday_role':
        return guild.birthday_role;
      default:
        return null;
    }
  }

  public async setInviteRole(
    guild_id: string,
    inviteCodeInput: string,
    role_id: string | null,
  ): Promise<Guild> {
    const code = normalizeInviteCode(inviteCodeInput);
    if (!code) {
      throw new Error('Invalid invite code');
    }

    let guild = await this.getGuildById(guild_id);
    if (!guild) {
      guild = await this.createGuild(guild_id);
    }

    const map: Record<string, string> = { ...(guild.invite_roles || {}) };
    if (role_id === null) {
      delete map[code];
    } else {
      map[code] = role_id;
    }

    guild.invite_roles = Object.keys(map).length > 0 ? map : null;
    await guild.save();
    return guild;
  }

  public getInviteRoleForNormalizedCode(
    guild: Guild | null,
    inviteCode: string,
  ): string | null {
    if (!guild?.invite_roles) return null;
    const code = normalizeInviteCode(inviteCode);
    return guild.invite_roles[code] ?? null;
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
        case 'birthday_channel':
          guild.birthday_channel = channel_id;
          break;
        case 'voice_activity_log_channel':
          guild.voice_activity_log_channel = channel_id;
          break;
        case 'ticket_channel':
          guild.ticket_channel = channel_id;
          break;
        case 'twitch_channel':
          guild.twitch_channel = channel_id;
          break;
        case 'youtube_channel':
          guild.youtube_channel = channel_id;
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

  public async setTicketPanelText(guild_id: string, title: string, description: string, image?: string | null): Promise<Guild> {
    let guild = await this.getGuildById(guild_id);
    if (!guild) {
      guild = await this.createGuild(guild_id);
    }
    guild.ticket_panel_title = title;
    guild.ticket_panel_description = description;
    guild.ticket_panel_image = image ?? null;
    await guild.save();
    return guild;
  }

  public async createGuildIfNotExists(id: string): Promise<Guild> {
    const existing = await this.getGuildById(id);
    if (existing) {
      return existing;
    }
    try {
      return await this.createGuild(id);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        const afterRace = await this.getGuildById(id);
        if (afterRace) {
          return afterRace;
        }
      }
      throw e;
    }
  }
}

export default new GuildService();
