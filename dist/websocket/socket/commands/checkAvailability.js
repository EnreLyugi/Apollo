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
exports.checkAvailability = void 0;
const client_1 = __importDefault(require("../../client"));
const checkAvailability = (data, ws) => __awaiter(void 0, void 0, void 0, function* () {
    const { guildId } = data;
    // Check if client is ready
    if (!client_1.default.isReady()) {
        ws.send(JSON.stringify({
            event: 'availability_response',
            available: false
        }));
        return;
    }
    // Check if bot is in the guild
    const guild = client_1.default.guilds.cache.get(guildId);
    const available = !!guild;
    // If bot is not in the guild, try to join (this only works if the bot has been invited)
    if (!available) {
        ws.send(JSON.stringify({
            event: 'availability_response',
            available: false
        }));
        return;
    }
    ws.send(JSON.stringify({
        event: 'availability_response',
        available
    }));
});
exports.checkAvailability = checkAvailability;
