import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TicketCategoryAttributes {
  id: number;
  guild_id: string;
  name: string;
  description: string | null;
}

interface TicketCategoryCreationAttributes extends Optional<TicketCategoryAttributes, 'id' | 'description'> {}

class TicketCategory extends Model<TicketCategoryAttributes, TicketCategoryCreationAttributes> implements TicketCategoryAttributes {
  public id!: number;
  public guild_id!: string;
  public name!: string;
  public description!: string | null;
}

TicketCategory.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'ticket_categories',
  }
);

export default TicketCategory;
