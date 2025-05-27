import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface ShipAttributes {
  user1: string,
  user2: string,
  value: number
}

class Ship extends Model<ShipAttributes> implements ShipAttributes {
  public user1!: string;
  public user2!: string;
  public value!: number;
}

Ship.init(
  {
    user1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'ships',
  }
)

export default Ship;