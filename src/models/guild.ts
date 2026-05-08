import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface GuildAttributes {
  id: string;
  prefix: string;
  language: string;
  color_roles_price: number;
  welcome_role: string | null;
  birthday_role: string | null;
  welcome_channel: string | null;
  birthday_channel: string | null;
  leave_channel: string | null;
  mod_log_channel: string | null;
  message_log_channel: string | null;
  voice_activity_log_channel: string | null;
  invite_roles: Record<string, string> | null;
  ticket_channel: string | null;
  ticket_role: string | null;
  ticket_panel_title: string | null;
  ticket_panel_description: string | null;
  ticket_panel_image: string | null;
  twitch_channel: string | null;
  youtube_channel: string | null;
}

interface GuildCreationAttributes extends 
  Optional<GuildAttributes, 
    'prefix' | 
    'language' |
    'color_roles_price' |
    'welcome_role' |
    'birthday_role' |
    'welcome_channel' | 
    'birthday_channel' |
    'leave_channel' | 
    'mod_log_channel' | 
    'message_log_channel' | 
    'voice_activity_log_channel' |
    'invite_roles' |
    'ticket_channel' |
    'ticket_role' |
    'ticket_panel_title' |
    'ticket_panel_description' |
    'ticket_panel_image' |
    'twitch_channel' |
    'youtube_channel'>{}

class Guild extends Model<GuildAttributes, GuildCreationAttributes> implements GuildAttributes {
  public id!: string;
  public prefix!: string;
  public language!: string;
  public color_roles_price!: number;
  public welcome_role!: string | null;
  public birthday_role!: string | null;
  public welcome_channel!: string | null;
  public birthday_channel!: string | null;
  public leave_channel!: string | null;
  public mod_log_channel!: string | null;
  public message_log_channel!: string | null;
  public voice_activity_log_channel!: string | null;
  public invite_roles!: Record<string, string> | null;
  public ticket_channel!: string | null;
  public ticket_role!: string | null;
  public ticket_panel_title!: string | null;
  public ticket_panel_description!: string | null;
  public ticket_panel_image!: string | null;
  public twitch_channel!: string | null;
  public youtube_channel!: string | null;
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
    color_roles_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1200
    },
    welcome_role: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    birthday_role: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    welcome_channel: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    birthday_channel: {
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
    },
    invite_roles: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    ticket_channel: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    ticket_role: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    ticket_panel_title: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    ticket_panel_description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    ticket_panel_image: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    twitch_channel: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    youtube_channel: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'guilds',
  }
);

export default Guild;