import { DataTypes, Model } from 'sequelize';
import sequelize from '../config//database';

interface XpChannelAttributes {
  channel_id: string;
  guild_id: string;
}

interface XpChannelCreationAttributes extends XpChannelAttributes {}

class XpChannel extends Model<XpChannelAttributes, XpChannelCreationAttributes> implements XpChannelAttributes {
  public channel_id!: string;
  public guild_id!: string;
}

XpChannel.init(
  {
    channel_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    guild_id: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'xp_channels',
  }
);

export default XpChannel;