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
const client_1 = __importDefault(require("../client"));
const ban_1 = __importDefault(require("../models/ban"));
class BanService {
    createBan(user_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = client_1.default.guilds.resolve(guild_id);
            if (guild) {
                const member = guild.members.resolve(user_id);
                if (member) {
                    yield member.ban();
                }
            }
            const hasBan = yield this.getBan(user_id, guild_id);
            if (hasBan) {
                return hasBan;
            }
            return yield ban_1.default.create({ user_id, guild_id });
        });
    }
    getBan(user_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ban_1.default.findOne({ where: { user_id, guild_id } });
        });
    }
    removeBan(user_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const banMember = yield this.getBan(user_id, guild_id);
            if (banMember) {
                return yield banMember.destroy();
            }
            return null;
        });
    }
}
exports.default = new BanService();
