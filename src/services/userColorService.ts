import { UserColor } from '../models';

class userColorService {
  public async addColor(user_id: string, guild_id: string, role_id: string): Promise<UserColor> {
    return await UserColor.create({ user_id, guild_id, role_id });
  }

  public async hasColor(user_id: string, guild_id: string, role_id: string): Promise<boolean> {
    const row = await UserColor.findOne({ where: { user_id, guild_id, role_id } });
    return !!row;
  }

  public async getUserColors(user_id: string, guild_id: string): Promise<UserColor[]> {
    return await UserColor.findAll({ where: { user_id, guild_id } });
  }

  public async getOwnedRoleIds(user_id: string, guild_id: string): Promise<Set<string>> {
    const rows = await UserColor.findAll({ where: { user_id, guild_id }, attributes: ['role_id'] });
    return new Set(rows.map(r => r.role_id));
  }

  public async getOwnersByRole(role_id: string): Promise<UserColor[]> {
    return await UserColor.findAll({ where: { role_id } });
  }

  public async removeByRole(role_id: string): Promise<number> {
    return await UserColor.destroy({ where: { role_id } });
  }

  public async getAllForGuild(guild_id: string): Promise<UserColor[]> {
    return await UserColor.findAll({ where: { guild_id } });
  }

  public async deleteAllForGuild(guild_id: string): Promise<number> {
    return await UserColor.destroy({ where: { guild_id } });
  }
}

export default new userColorService();
