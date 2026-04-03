"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config//database"));
class WelcomeSettings extends sequelize_1.Model {
}
WelcomeSettings.init({
    channel_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    guild_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Welcome to {servername}!'
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Hello {username}, be welcome to {servername}!'
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize: database_1.default,
    tableName: 'welcome_settings',
});
exports.default = WelcomeSettings;
