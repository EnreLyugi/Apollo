import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TwitchStreamerAttributes {
  id: number;
  guild_id: string;
  twitch_username: string;
  twitch_user_id: string;
  subscription_id: string | null;
  custom_description: string | null;
}

interface TwitchStreamerCreationAttributes extends Optional<TwitchStreamerAttributes, 'id' | 'subscription_id' | 'custom_description'> {}

class TwitchStreamer extends Model<TwitchStreamerAttributes, TwitchStreamerCreationAttributes> implements TwitchStreamerAttributes {
  public id!: number;
  public guild_id!: string;
  public twitch_username!: string;
  public twitch_user_id!: string;
  public subscription_id!: string | null;
  public custom_description!: string | null;
}

TwitchStreamer.init(
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
    twitch_username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    twitch_user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscription_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    custom_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'twitch_streamers',
  }
);

export default TwitchStreamer;
