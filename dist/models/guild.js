"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Guild extends sequelize_1.Model {
}
Guild.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    prefix: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: '.'
    },
    language: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'en-US'
    },
    color_roles_price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1200
    },
    welcome_role: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    birthday_role: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    welcome_channel: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    birthday_channel: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    leave_channel: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    mod_log_channel: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    message_log_channel: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    voice_activity_log_channel: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    invite_roles: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
    },
    ticket_channel: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    ticket_role: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    ticket_panel_title: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    ticket_panel_description: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: null,
    },
}, {
    sequelize: database_1.default,
    tableName: 'guilds',
});
exports.default = Guild;
