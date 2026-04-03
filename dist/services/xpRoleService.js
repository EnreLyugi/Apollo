"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
class xpRoleService {
    addRole(role_id, guild_id, level, xp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.XpRole.create({ role_id, guild_id, level, xp });
        });
    }
    removeRole(role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.XpRole.destroy({ where: { role_id } });
        });
    }
    getRole(role_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.XpRole.findOne({ where: { role_id, guild_id } });
        });
    }
    getCurrentRole(guild_id, xp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.XpRole.findOne({
                where: {
                    guild_id,
                    xp: {
                        [sequelize_1.Op.lte]: xp
                    }
                },
                order: [['xp', 'DESC']]
            });
        });
    }
    getPreviousRoles(guild_id, xp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.XpRole.findAll({
                where: {
                    guild_id,
                    xp: {
                        [sequelize_1.Op.lte]: xp
                    }
                },
                order: [['xp', 'DESC']]
            });
        });
    }
    getUnreachedRoles(guild_id, xp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.XpRole.findAll({
                where: {
                    guild_id,
                    xp: {
                        [sequelize_1.Op.gt]: xp
                    }
                },
                order: [['xp', 'ASC']]
            });
        });
    }
    listRolesByGuild(guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.XpRole.findAll({
                where: { guild_id },
                order: [['xp', 'ASC']],
            });
        });
    }
    updateRoleXp(role_id, guild_id, xp, level) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRole(role_id, guild_id);
            if (!row)
                return null;
            row.xp = xp;
            if (typeof level === 'number') {
                row.level = level;
            }
            yield row.save();
            return row;
        });
    }
}
exports.default = new xpRoleService();
