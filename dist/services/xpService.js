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
const xpChannelService_1 = __importDefault(require("./xpChannelService"));
const _1 = require("./");
const member_1 = __importDefault(require("../models/member"));
class xpService {
    constructor() {
        this.cooldownArray = [];
    }
    addCooldown(userId, guildId) {
        this.cooldownArray.push(`${userId}:${guildId}`);
    }
    removeCooldown(userId, guildId) {
        this.cooldownArray.splice(this.cooldownArray.indexOf(`${userId}:${guildId}`), 1);
    }
    hasCooldown(userId, guildId) {
        return this.cooldownArray.includes(`${userId}:${guildId}`);
    }
    handleRoles(guild, member, xp) {
        return __awaiter(this, void 0, void 0, function* () {
            const xpRoles = yield _1.xpRoleService.getPreviousRoles(guild.id, xp);
            const unreachedRoles = yield _1.xpRoleService.getUnreachedRoles(guild.id, xp);
            if (xpRoles) {
                for (let index = 0; index < xpRoles.length; index++) {
                    const role = xpRoles[index];
                    if (index === 0) {
                        if (!member.roles.cache.has(role.role_id)) {
                            yield member.roles.add(role.role_id).catch(() => { });
                        }
                    }
                    else if (member.roles.cache.has(role.role_id)) {
                        yield member.roles.remove(role.role_id).catch(() => { });
                    }
                }
            }
            if (unreachedRoles) {
                for (const role of unreachedRoles) {
                    if (member.roles.cache.has(role.role_id)) {
                        yield member.roles.remove(role.role_id).catch(() => { });
                    }
                }
            }
        });
    }
    resyncGuildXpRoles(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield member_1.default.findAll({ where: { guild_id: guild.id } });
            const delay = (ms) => new Promise((r) => setTimeout(r, ms));
            let synced = 0;
            for (const row of rows) {
                let member;
                try {
                    member = yield guild.members.fetch(row.member_id);
                }
                catch (_a) {
                    continue;
                }
                yield this.handleRoles(guild, member, row.xp);
                synced++;
                yield delay(120);
            }
            return synced;
        });
    }
    handleXP(channel, guild, member) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = member.user;
            const userData = yield _1.userService.createUserIfNotExists(user.id, user.username);
            const memberData = yield _1.memberService.createMemberIfNotExists(user.id, guild.id);
            const guildData = yield _1.guildService.createGuildIfNotExists(guild.id);
            //console.log(`${member.displayName} tem dados?`);
            if (!userData || !guildData || !memberData)
                return;
            //console.log(`${member.displayName} tem`);
            const isXpDisabled = yield xpChannelService_1.default.getChannel(channel.id, guild.id);
            if (isXpDisabled) {
                //console.log(`${member.displayName} xp desativado`);
                return;
            }
            ;
            if (this.hasCooldown(user.id, guild.id)) {
                //console.log(`${member.displayName} está em cooldown`);
                return;
            }
            ;
            const xp = Math.round(Math.random() * 9) + 1;
            console.log(`${xp}xp added to ${member.displayName} in ${guild.name}`);
            [userData, memberData].forEach((data) => __awaiter(this, void 0, void 0, function* () {
                data.xp += xp;
                yield data.save();
            }));
            memberData.coin++;
            yield memberData.save();
            yield this.handleRoles(guild, member, memberData.xp);
            this.addCooldown(user.id, guild.id);
            setTimeout(() => this.removeCooldown(user.id, guild.id), 60000);
        });
    }
    addXP(guild, member, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberData = yield _1.memberService.createMemberIfNotExists(member.id, guild.id);
            if (!memberData)
                return;
            memberData.xp += amount;
            yield memberData.save();
            yield this.handleRoles(guild, member, memberData.xp);
            //console.log(`${amount}xp adicionado para ${member.displayName} em ${guild.name}`);
            return memberData;
        });
    }
    removeXP(guild, member, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberData = yield _1.memberService.createMemberIfNotExists(member.id, guild.id);
            if (!memberData)
                return;
            memberData.xp = Math.max(0, memberData.xp - amount);
            yield memberData.save();
            yield this.handleRoles(guild, member, memberData.xp);
            return memberData;
        });
    }
    getTop5(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield member_1.default.findAll({
                where: {
                    guild_id: guild.id
                },
                order: [['xp', 'DESC']],
                limit: 5
            });
        });
    }
    getTop10(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield member_1.default.findAll({
                where: {
                    guild_id: guild.id
                },
                order: [['xp', 'DESC']],
                limit: 10
            });
        });
    }
    resetXP(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield member_1.default.update({ xp: 0 }, {
                where: {
                    guild_id: guild.id
                }
            });
        });
    }
}
exports.default = new xpService();
