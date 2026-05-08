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
exports.onPlayerResume = void 0;
const syncMusicPresence_1 = require("../utils/syncMusicPresence");
const onPlayerResume = (queue) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = queue.metadata;
    yield ((_a = data.playerMessage) === null || _a === void 0 ? void 0 : _a.setState('playing', queue));
    (0, syncMusicPresence_1.syncMusicPresence)();
});
exports.onPlayerResume = onPlayerResume;
