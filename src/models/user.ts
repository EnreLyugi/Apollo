import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config//database';

interface UserAttributes {
  id: string;
  username: string;
  xp: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'xp'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public xp!: number;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export default User;