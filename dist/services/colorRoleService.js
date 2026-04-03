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
class colorRoleService {
    addRole(role_id, guild_id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.ColorRole.create({ role_id, guild_id, name });
        });
    }
    removeRole(role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.ColorRole.destroy({ where: { role_id } });
        });
    }
    getRole(role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.ColorRole.findOne({ where: { role_id } });
        });
    }
    getGuildRoles(guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.ColorRole.findAll({ where: { guild_id } });
        });
    }
}
exports.default = new colorRoleService();
