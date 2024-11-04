import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface GuildAttributes {
  id: string;
  prefix: string;
  language: string;
  welcome_role: string | null;
  welcome_channel: string | null;
  leave_channel: string | null;
  mod_log_channel: string | null;
  message_log_channel: string | null;
  voice_activity_log_channel: string | null;
}

interface GuildCreationAttributes extends 
  Optional<GuildAttributes, 
    'prefix' | 
    'language' | 
    'welcome_role' |
    'welcome_channel' | 
    'leave_channel' | 
    'mod_log_channel' | 
    'message_log_channel' | 
    'voice_activity_log_channel'>{}

class Guild extends Model<GuildAttributes, GuildCreationAttributes> implements GuildAttributes {
  public id!: string;
  public prefix!: string;
  public language!: string;
  public welcome_role!: string | null;
  public welcome_channel!: string | null;
  public leave_channel!: string | null;
  public mod_log_channel!: string | null;
  public message_log_channel!: string | null;
  public voice_activity_log_channel!: string | null;
}

Guild.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '.'
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'en-US'
    },
    welcome_role: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    welcome_channel: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    leave_channel: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    mod_log_channel: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    message_log_channel: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    voice_activity_log_channel: {
      type: DataTypes.STRING,
      defaultValue: null
    }
  },
  {
    sequelize,
    tableName: 'guilds',
  }
);

export default Guild;