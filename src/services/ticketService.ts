import { Op, QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import Ticket from '../models/ticket';

function normalizeSnowflake(id: string): string {
  return String(id).trim();
}

class TicketService {
  public async createTicket(guildId: string, userId: string, channelId: string, categoryId: number): Promise<Ticket> {
    return await Ticket.create({
      guild_id: normalizeSnowflake(guildId),
      user_id: normalizeSnowflake(userId),
      channel_id: normalizeSnowflake(channelId),
      category_id: categoryId,
    });
  }

  public async getOpenTicketByUser(guildId: string, userId: string): Promise<Ticket | null> {
    const gid = normalizeSnowflake(guildId);
    const uid = normalizeSnowflake(userId);
    const rows = await Ticket.findAll({
      where: {
        guild_id: { [Op.eq]: gid },
        user_id: { [Op.eq]: uid },
        status: { [Op.eq]: 'open' },
      },
      order: [['id', 'DESC']],
      limit: 1,
    });
    return rows[0] ?? null;
  }

  /**
   * Resolve o ticket aberto do utilizador a partir da BD (fonte de verdade).
   * Usa ordenação por id DESC e, se o ORM não devolver linha, um SELECT explícito no Postgres
   * (útil com ENUM/casting ou dados legados com espaços em user_id).
   */
  public async getOpenTicketByUserId(userId: string): Promise<Ticket | null> {
    const uid = normalizeSnowflake(userId);
    if (!uid) return null;

    const rows = await Ticket.findAll({
      where: {
        user_id: { [Op.eq]: uid },
        status: { [Op.eq]: 'open' },
      },
      order: [['id', 'DESC']],
      limit: 1,
    });
    if (rows.length > 0) return rows[0];

    const raw = await sequelize.query<{ id: number }>(
      `SELECT id FROM tickets
       WHERE TRIM(user_id::text) = :uid AND status::text = 'open'
       ORDER BY id DESC
       LIMIT 1`,
      { replacements: { uid }, type: QueryTypes.SELECT }
    );
    const first = raw[0];
    if (!first?.id) return null;
    return (await Ticket.findByPk(first.id)) ?? null;
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
