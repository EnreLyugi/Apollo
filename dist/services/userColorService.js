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
const models_1 = require("../models");
class userColorService {
    addColor(user_id, guild_id, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.UserColor.create({ user_id, guild_id, role_id });
        });
    }
    hasColor(user_id, guild_id, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield models_1.UserColor.findOne({ where: { user_id, guild_id, role_id } });
            return !!row;
        });
    }
    getUserColors(user_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.UserColor.findAll({ where: { user_id, guild_id } });
        });
    }
    getOwnedRoleIds(user_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield models_1.UserColor.findAll({ where: { user_id, guild_id }, attributes: ['role_id'] });
            return new Set(rows.map(r => r.role_id));
        });
    }
    getOwnersByRole(role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.UserColor.findAll({ where: { role_id } });
        });
    }
    removeByRole(role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.UserColor.destroy({ where: { role_id } });
        });
    }
    getAllForGuild(guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.UserColor.findAll({ where: { guild_id } });
        });
    }
    deleteAllForGuild(guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.UserColor.destroy({ where: { guild_id } });
        });
    }
}
exports.default = new userColorService();
