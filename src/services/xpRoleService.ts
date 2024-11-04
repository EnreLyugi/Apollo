import { Op } from 'sequelize';
import { XpRole } from '../models';

class xpRoleService {
  public async addRole(role_id: string, guild_id: string, level: number, xp: number): Promise<XpRole> {
    return await XpRole.create({ role_id, guild_id, level, xp });
  }

  public async removeRole(role_id: string): Promise<number> {
    return await XpRole.destroy({ where: { role_id } })
  }

  public async getRole(role_id: string, guild_id: string): Promise<XpRole | null> {
    return await XpRole.findOne({ where: { role_id, guild_id } })
  }

  public async getCurrentRole(guild_id: string, xp: number): Promise<XpRole | null> {
    return await XpRole.findOne({
      where: {
        guild_id,
        xp: {
          [Op.lte]: xp
        }
      },
      order: [['xp', 'DESC']]
    });
  }

  public async getPreviousRoles(guild_id: string, xp: number): Promise<XpRole[] | null> {
    return await XpRole.findAll({
      where: {
        guild_id,
        xp: {
          [Op.lte]: xp
        }
      },
      order: [['xp', 'DESC']]
    });
  }

  public async getUnreachedRoles(guild_id: string, xp: number): Promise<XpRole[] | null> {
    return await XpRole.findAll({
      where: {
        guild_id,
        xp: {
          [Op.gt]: xp
        }
      },
      order: [['xp', 'ASC']]
    });
  }
}

export default new xpRoleService();
