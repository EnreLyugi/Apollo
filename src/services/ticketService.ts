import Ticket from '../models/ticket';

class TicketService {
  public async createTicket(guildId: string, userId: string, channelId: string, categoryId: number): Promise<Ticket> {
    return await Ticket.create({
      guild_id: guildId,
      user_id: userId,
      channel_id: channelId,
      category_id: categoryId,
    });
  }

  public async getOpenTicketByUser(guildId: string, userId: string): Promise<Ticket | null> {
    return await Ticket.findOne({ where: { guild_id: guildId, user_id: userId, status: 'open' } });
  }

  public async getOpenTicketByUserId(userId: string): Promise<Ticket | null> {
    return await Ticket.findOne({ where: { user_id: userId, status: 'open' } });
  }

  public async getTicketByChannel(channelId: string): Promise<Ticket | null> {
    return await Ticket.findOne({ where: { channel_id: channelId, status: 'open' } });
  }

  public async closeTicket(channelId: string): Promise<boolean> {
    const [updated] = await Ticket.update({ status: 'closed' }, { where: { channel_id: channelId, status: 'open' } });
    return updated > 0;
  }
}

export default new TicketService();
