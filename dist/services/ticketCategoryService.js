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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticketCategory_1 = __importDefault(require("../models/ticketCategory"));
class TicketCategoryService {
    getCategories(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketCategory_1.default.findAll({ where: { guild_id: guildId } });
        });
    }
    addCategory(guildId, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketCategory_1.default.create({ guild_id: guildId, name, description: description || null });
        });
    }
    removeCategory(id, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield ticketCategory_1.default.destroy({ where: { id, guild_id: guildId } });
            return deleted > 0;
        });
    }
    getCategoryByName(guildId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketCategory_1.default.findOne({ where: { guild_id: guildId, name } });
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticketCategory_1.default.findByPk(id);
        });
    }
}
exports.default = new TicketCategoryService();
