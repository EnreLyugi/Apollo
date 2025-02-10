import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config//database';

interface MemberAttributes {
  id: number;
  member_id: string;
  guild_id: string;
  xp: number;
  coin: number;
}

interface MemberCreationAttributes extends Optional<Optional<Omit<MemberAttributes, 'id'>, 'xp'>, 'coin'> {}

class Member extends Model<MemberAttributes, MemberCreationAttributes> implements MemberAttributes {
  public id!: number;
  public member_id!: string;
  public guild_id!: string;
  public xp!: number;
  public coin!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Member.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guild_id: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    coin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'Member',
    tableName: 'members',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['member_id', 'guild_id']
      }
    ]
  }
);

export default Member;