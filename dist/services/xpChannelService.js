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
const xpChannel_1 = __importDefault(require("../models/xpChannel"));
class xpChannelService {
    addChannel(channel_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield xpChannel_1.default.create({ channel_id, guild_id });
        });
    }
    removeChannel(channel_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield xpChannel_1.default.destroy({ where: { channel_id, guild_id } });
        });
    }
    getChannel(channel_id, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield xpChannel_1.default.findOne({ where: { channel_id, guild_id } });
        });
    }
}
exports.default = new xpChannelService();
