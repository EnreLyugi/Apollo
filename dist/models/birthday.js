"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Birthday extends sequelize_1.Model {
}
Birthday.init({
    user_id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true
    },
    date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: database_1.default,
    tableName: 'birthdays',
});
exports.default = Birthday;
