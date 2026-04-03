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
exports.onMessage = void 0;
const __1 = require("../");
const commands_1 = require("../commands");
const play_1 = require("../commands/play");
const stop_1 = require("../commands/stop");
const skip_1 = require("../commands/skip");
const localization_1 = require("../../../utils/localization");
const onMessage = (message, wsId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(message.toString());
    const ws = __1.sockets.get(wsId);
    if (!ws)
        return;
    const command = data.command;
    switch (command) {
        case 'connect':
            (0, commands_1.connectClient)(ws);
            break;
        case 'disconnect':
            (0, commands_1.disconnectClient)(ws);
            break;
        case 'play':
            (0, play_1.play)(data, wsId);
            break;
        case 'stop':
            (0, stop_1.stop)(data, wsId);
            break;
        case 'skip':
            (0, skip_1.skip)(data, wsId);
            break;
        case 'check_availability':
            (0, commands_1.checkAvailability)(data, ws);
            break;
        default:
            ws.send(JSON.stringify({ event: 'error', message: (0, localization_1.t)('errors.unknown_command', 'en-US') }));
            break;
    }
});
exports.onMessage = onMessage;
