import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface UserColorAttributes {
  id?: number;
  user_id: string;
  guild_id: string;
  role_id: string;
}

interface UserColorCreationAttributes extends Omit<UserColorAttributes, 'id'> {}

class UserColor extends Model<UserColorAttributes, UserColorCreationAttributes> implements UserColorAttributes {
  public id!: number;
  public user_id!: string;
  public guild_id!: string;
  public role_id!: string;
}

UserColor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guild_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_colors',
    indexes: [
      { unique: true, fields: ['user_id', 'guild_id', 'role_id'] },
    ],
  }
);

export default UserColor;
