import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface BirthdayAttributes {
  user_id: string,
  date: string
}

class Birthday extends Model<BirthdayAttributes> implements BirthdayAttributes {
  public user_id!: string;
  public date!: string;
}

Birthday.init(
  {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'birthdays',
  }
)

export default Birthday;