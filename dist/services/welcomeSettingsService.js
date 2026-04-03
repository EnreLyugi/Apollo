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
class WelcomeSettingsService {
    fetch(guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.WelcomeSettings.findOne({ where: { guild_id } });
        });
    }
    create(channel_id, guild_id, title, description, image) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.WelcomeSettings.create({ channel_id, guild_id, title, description, image });
        });
    }
    saveSettings(channel_id, guild_id, title, description, image) {
        return __awaiter(this, void 0, void 0, function* () {
            var welcomeSettings = yield this.fetch(guild_id);
            if (!welcomeSettings) {
                welcomeSettings = yield this.create(channel_id, guild_id, title, description, image);
            }
            welcomeSettings.channel_id = channel_id;
            welcomeSettings.guild_id = guild_id;
            welcomeSettings.title = title;
            welcomeSettings.description = description;
            welcomeSettings.image = image;
            yield welcomeSettings.save();
            return welcomeSettings;
        });
    }
}
exports.default = new WelcomeSettingsService();
