"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Ticket extends sequelize_1.Model {
}
Ticket.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    guild_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    channel_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('open', 'closed'),
        allowNull: false,
        defaultValue: 'open',
    },
}, {
    sequelize: database_1.default,
    tableName: 'tickets',
});
exports.default = Ticket;
