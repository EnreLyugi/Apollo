import TicketCategory from '../models/ticketCategory';

class TicketCategoryService {
  public async getCategories(guildId: string): Promise<TicketCategory[]> {
    return await TicketCategory.findAll({ where: { guild_id: guildId } });
  }

  public async addCategory(guildId: string, name: string, description?: string): Promise<TicketCategory> {
    return await TicketCategory.create({ guild_id: guildId, name, description: description || null });
  }

  public async removeCategory(id: number, guildId: string): Promise<boolean> {
    const deleted = await TicketCategory.destroy({ where: { id, guild_id: guildId } });
    return deleted > 0;
  }

  public async getCategoryByName(guildId: string, name: string): Promise<TicketCategory | null> {
    return await TicketCategory.findOne({ where: { guild_id: guildId, name } });
  }

  public async getCategoryById(id: number): Promise<TicketCategory | null> {
    return await TicketCategory.findByPk(id);
  }
}

export default new TicketCategoryService();
