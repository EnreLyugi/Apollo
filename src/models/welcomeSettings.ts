import { DataTypes, Model } from 'sequelize';
import sequelize from '../config//database';

interface WelcomeSettingsAttributes {
  channel_id: string;
  guild_id: string;
  title: string;
  description: string;
  image: string;
}

interface WelcomeSettingsCreationAttributes extends WelcomeSettingsAttributes {}

class WelcomeSettings extends Model<WelcomeSettingsAttributes, WelcomeSettingsCreationAttributes> implements WelcomeSettingsAttributes {
  public channel_id!: string;
  public guild_id!: string;
  public title!: string;
  public description!: string;
  public image!: string;
}

WelcomeSettings.init(
  {
    channel_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    guild_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Welcome to {servername}!'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Hello {username}, be welcome to {servername}!'
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize,
    tableName: 'welcome_settings',
  }
);

export default WelcomeSettings;