import { ColorRole } from '../models';

class colorRoleService {
  public async addRole(role_id: string, guild_id: string, name: string): Promise<ColorRole> {
    return await ColorRole.create({ role_id, guild_id, name });
  }

  public async removeRole(role_id: string): Promise<number> {
    return await ColorRole.destroy({ where: { role_id } })
  }

  public async getRole(role_id: string): Promise<ColorRole | null> {
    return await ColorRole.findOne({ where: { role_id } })
  }

  public async getGuildRoles(guild_id: string): Promise<ColorRole[] | null> {
    return await ColorRole.findAll({ where: { guild_id } })
  }
}

export default new colorRoleService();
