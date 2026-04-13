import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TicketAttributes {
  id: number;
  guild_id: string;
  user_id: string;
  channel_id: string;
  category_id: number;
  status: 'open' | 'closed';
}

interface TicketCreationAttributes extends Optional<TicketAttributes, 'id' | 'status'> {}

class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  public id!: number;
  public guild_id!: string;
  public user_id!: string;
  public channel_id!: string;
  public category_id!: number;
  public status!: 'open' | 'closed';
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    guild_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    channel_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'open',
    },
  },
  {
    sequelize,
    tableName: 'tickets',
  }
);

export default Ticket;
