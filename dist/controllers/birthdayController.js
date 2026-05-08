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
const birthdayService_1 = __importDefault(require("../services/birthdayService"));
const client_1 = __importDefault(require("../client"));
const services_1 = require("../services");
const localization_1 = require("../utils/localization");
const models_1 = require("../models");
const config_1 = require("../config");
class BirthdayController {
    notifyBirthdays() {
        return __awaiter(this, void 0, void 0, function* () {
            const birthdays = yield birthdayService_1.default.getBirthdays();
            if (birthdays && birthdays.length > 0) {
                for (const birthday of birthdays) {
                    const user = yield client_1.default.users.fetch(birthday.user_id);
                    if (!user)
                        continue;
                    for (const guild of client_1.default.guilds.cache.values()) {
                        try {
                            const member = yield guild.members.fetch(birthday.user_id);
                            if (!member)
                                continue;
                            const guildData = yield services_1.guildService.getGuildById(guild.id);
                            if (!guildData)
                                continue;
                            if (guildData.birthday_channel) {
                                const channel = guild.channels.resolve(guildData.birthday_channel);
                                if (!channel)
                                    continue;
                                if (!channel.isTextBased())
                                    continue;
                                const locale = (0, localization_1.mapLocale)(guild.preferredLocale);
                                const embed = new models_1.Embed()
                                    .setColor(`#${config_1.colors.default_color}`)
                                    .setTitle((0, localization_1.t)('client.birthday.title', locale))
                                    .setTimestamp(new Date())
                                    .setDescription((0, localization_1.format)((0, localization_1.t)(`client.birthday.body`, locale), {
                                    "member": `${member}`
                                }))
                                    .setFooter({
                                    text: (0, localization_1.format)((0, localization_1.t)(`client.birthday.footer`, locale), {
                                        "guildName": guild.name
                                    })
                                })
                                    .setImage({ url: "https://pa1.aminoapps.com/6479/9747b7158d4a21faaaebabc9e3a88880bb1f45a7_hq.gif" });
                                yield channel.send({ content: `@everyone`, embeds: [embed.build()] });
                            }
                            if (guildData.birthday_role) {
                                const role = guild.roles.resolve(guildData.birthday_role);
                                if (!role)
                                    continue;
                                yield member.roles.add(role);
                            }
                        }
                        catch (e) {
                            console.error(e);
                            continue;
                        }
                    }
                }
            }
        });
    }
    removeBirthdayRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const guild of client_1.default.guilds.cache.values()) {
                try {
                    const guildData = yield services_1.guildService.getGuildById(guild.id);
                    if (!guildData || !guildData.birthday_role)
                        continue;
                    const role = guild.roles.resolve(guildData.birthday_role);
                    if (!role)
                        continue;
                    const membersWithRole = role.members;
                    for (const member of membersWithRole.values()) {
                        try {
                            yield member.roles.remove(role);
                        }
                        catch (err) {
                            console.error(err);
                            continue;
                        }
                    }
                }
                catch (err) {
                    console.error(err);
                    continue;
                }
            }
        });
    }
}
exports.default = new BirthdayController();
