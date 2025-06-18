import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface BanAttributes {
  user_id: string,
  guild_id: string
}

class Ban extends Model<BanAttributes> implements BanAttributes {
  public user_id!: string;
  public guild_id!: string;
}

Ban.init(
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    guild_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'bans',
  }
)

export default Ban;