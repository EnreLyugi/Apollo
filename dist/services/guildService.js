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
const guild_1 = __importDefault(require("../models/guild"));
const inviteCode_1 = require("../utils/inviteCode");
class GuildService {
    createGuild(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield guild_1.default.create({ id });
        });
    }
    getGuildById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield guild_1.default.findByPk(id);
        });
    }
    setRole(roleType, guild_id, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var guild = yield this.getGuildById(guild_id);
                if (!guild) {
                    guild = yield this.createGuild(guild_id);
                }
                switch (roleType) {
                    case 'welcome_role':
                        guild.welcome_role = role_id;
                        break;
                    case 'birthday_role':
                        guild.birthday_role = role_id;
                        break;
                    case 'ticket_role':
                        guild.ticket_role = role_id;
                        break;
                    default:
                        throw new Error('Invalid Role Type');
                }
                yield guild.save();
                return guild;
            }
            catch (e) {
                throw new Error('An Error Ocurred on setting welcome role!');
            }
        });
    }
    getRole(roleType, guild_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = yield this.getGuildById(guild_id);
            if (!guild)
                return null;
            switch (roleType) {
                case 'welcome_role':
                    return guild.welcome_role;
                case 'birthday_role':
                    return guild.birthday_role;
                default:
                    return null;
            }
        });
    }
    setInviteRole(guild_id, inviteCodeInput, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = (0, inviteCode_1.normalizeInviteCode)(inviteCodeInput);
            if (!code) {
                throw new Error('Invalid invite code');
            }
            let guild = yield this.getGuildById(guild_id);
            if (!guild) {
                guild = yield this.createGuild(guild_id);
            }
            const map = Object.assign({}, (guild.invite_roles || {}));
            if (role_id === null) {
                delete map[code];
            }
            else {
                map[code] = role_id;
            }
            guild.invite_roles = Object.keys(map).length > 0 ? map : null;
            yield guild.save();
            return guild;
        });
    }
    getInviteRoleForNormalizedCode(guild, inviteCode) {
        var _a;
        if (!(guild === null || guild === void 0 ? void 0 : guild.invite_roles))
            return null;
        const code = (0, inviteCode_1.normalizeInviteCode)(inviteCode);
        return (_a = guild.invite_roles[code]) !== null && _a !== void 0 ? _a : null;
    }
    setChannel(channelType, guild_id, channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var guild = yield this.getGuildById(guild_id);
                if (!guild) {
                    guild = yield this.createGuild(guild_id);
                }
                switch (channelType) {
                    case 'welcome_channel':
                        guild.welcome_channel = channel_id;
                        break;
                    case 'birthday_channel':
                        guild.birthday_channel = channel_id;
                        break;
                    case 'voice_activity_log_channel':
                        guild.voice_activity_log_channel = channel_id;
                        break;
                    case 'ticket_channel':
                        guild.ticket_channel = channel_id;
                        break;
                    default:
                        throw new Error('Invalid Channel Type');
                }
                yield guild.save();
                return guild;
            }
            catch (e) {
                throw new Error('An Error Ocurred on setting welcome channel!');
            }
        });
    }
    setTicketPanelText(guild_id, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            let guild = yield this.getGuildById(guild_id);
            if (!guild) {
                guild = yield this.createGuild(guild_id);
            }
            guild.ticket_panel_title = title;
            guild.ticket_panel_description = description;
            yield guild.save();
            return guild;
        });
    }
    createGuildIfNotExists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const guild = yield this.getGuildById(id);
                if (!guild) {
                    return yield this.createGuild(id);
                }
                return guild;
            }
            catch (e) {
                throw new Error('An Error Ocurred on creating a new guild!');
            }
        });
    }
}
exports.default = new GuildService();
