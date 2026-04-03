"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Ship extends sequelize_1.Model {
}
Ship.init({
    user1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    user2: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    tableName: 'ships',
});
exports.default = Ship;
