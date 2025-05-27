import { DataTypes, Model } from 'sequelize';
import sequelize from '../config//database';

interface XpRoleAttributes {
  role_id: string;
  guild_id: string;
  level: number;
  xp: number;
}

interface XpRoleCreationAttributes extends XpRoleAttributes {}

class XpRole extends Model<XpRoleAttributes, XpRoleCreationAttributes> implements XpRoleAttributes {
  public role_id!: string;
  public guild_id!: string;
  public level!: number;
  public xp!: number;
}

XpRole.init(
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
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'xp_roles',
  }
);

export default XpRole;