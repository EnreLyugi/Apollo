import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface YouTubeChannelAttributes {
  id: number;
  guild_id: string;
  youtube_channel_id: string;
  channel_name: string;
}

interface YouTubeChannelCreationAttributes extends Optional<YouTubeChannelAttributes, 'id'> {}

class YouTubeChannel extends Model<YouTubeChannelAttributes, YouTubeChannelCreationAttributes> implements YouTubeChannelAttributes {
  public id!: number;
  public guild_id!: string;
  public youtube_channel_id!: string;
  public channel_name!: string;
}

YouTubeChannel.init(
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
    youtube_channel_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    channel_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'youtube_channels',
  }
);

export default YouTubeChannel;
