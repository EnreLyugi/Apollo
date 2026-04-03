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
exports.onMessageCreate = void 0;
const services_1 = require("../../services/");
const onMessageCreate = (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = (_a = message.member) === null || _a === void 0 ? void 0 : _a.user;
    const guild = message.guild;
    if (!guild || !user || user.bot)
        return;
    yield services_1.xpService.handleXP(message.channel, guild, message.member);
});
exports.onMessageCreate = onMessageCreate;
