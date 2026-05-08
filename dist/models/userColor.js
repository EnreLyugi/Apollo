"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class UserColor extends sequelize_1.Model {
}
UserColor.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    guild_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    role_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: 'user_colors',
    indexes: [
        { unique: true, fields: ['user_id', 'guild_id', 'role_id'] },
    ],
});
exports.default = UserColor;
