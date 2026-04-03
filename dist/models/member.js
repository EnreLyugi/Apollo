"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config//database"));
class Member extends sequelize_1.Model {
}
Member.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    member_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    guild_id: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    xp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    coin: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: database_1.default,
    modelName: 'Member',
    tableName: 'members',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['member_id', 'guild_id']
        }
    ]
});
exports.default = Member;
