import { DataTypes, Model } from 'sequelize';
import sequelize from '../config//database';

interface ColorRoleAttributes {
  role_id: string;
  guild_id: string;
  name: string;
}

interface ColorRoleCreationAttributes extends ColorRoleAttributes {}

class ColorRole extends Model<ColorRoleAttributes, ColorRoleCreationAttributes> implements ColorRoleAttributes {
  public role_id!: string;
  public guild_id!: string;
  public name!: string;
}

ColorRole.init(
  {
    role_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    guild_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'color_roles',
  }
);

export default ColorRole;