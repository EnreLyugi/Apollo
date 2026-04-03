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
class BirthdayService {
    addBirthday(user_id, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentBirthday = yield models_1.Birthday.findOne({ where: { user_id } });
            if (currentBirthday) {
                currentBirthday.date = date;
                yield currentBirthday.save();
                return currentBirthday;
            }
            return yield models_1.Birthday.create({ user_id, date });
        });
    }
    getBirthdays() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const formattedDate = `${day}/${month}`;
            return yield models_1.Birthday.findAll({
                where: {
                    date: formattedDate
                }
            });
        });
    }
}
exports.default = new BirthdayService();
