"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Ban extends sequelize_1.Model {
}
Ban.init({
    user_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    guild_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    tableName: 'bans',
});
exports.default = Ban;
