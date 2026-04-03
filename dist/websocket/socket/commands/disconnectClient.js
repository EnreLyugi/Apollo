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
exports.disconnectClient = void 0;
const client_1 = __importDefault(require("../../client"));
const utils_1 = require("../utils");
const localization_1 = require("../../../utils/localization");
const disconnectClient = (ws) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, utils_1.disconnectDiscordClient)();
    ws.send(JSON.stringify({
        event: 'disconnected',
        status: !client_1.default.isReady() ? (0, localization_1.t)('websocket.bot_disconnected', 'en-US') : (0, localization_1.t)('websocket.disconnect_error', 'en-US')
    }));
});
exports.disconnectClient = disconnectClient;
