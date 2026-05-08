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
const member_1 = __importDefault(require("../models/member"));
class MemberService {
    createMember(member_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield member_1.default.create({ member_id, guild_id });
        });
    }
    getMember(member_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield member_1.default.findOne({ where: { member_id, guild_id } });
        });
    }
    createMemberIfNotExists(member_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const member = yield this.getMember(member_id, guild_id);
                if (!member) {
                    return yield this.createMember(member_id, guild_id);
                }
                return member;
            }
            catch (e) {
                console.error("Error in createMemberIfNotExists:", e);
                throw new Error('An Error Occurred on creating a new user!');
            }
        });
    }
    /** Zera moedas de todos os membros registados neste servidor. */
    resetCoinsForGuild(guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [affected] = yield member_1.default.update({ coin: 0 }, { where: { guild_id } });
            return affected;
        });
    }
}
exports.default = new MemberService();
