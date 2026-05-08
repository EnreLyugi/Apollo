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
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const ticket_1 = __importDefault(require("../models/ticket"));
function normalizeSnowflake(id) {
    return String(id).trim();
}
class TicketService {
    createTicket(guildId, userId, channelId, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticket_1.default.create({
                guild_id: normalizeSnowflake(guildId),
                user_id: normalizeSnowflake(userId),
                channel_id: normalizeSnowflake(channelId),
                category_id: categoryId,
            });
        });
    }
    getOpenTicketByUser(guildId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const gid = normalizeSnowflake(guildId);
            const uid = normalizeSnowflake(userId);
            const rows = yield ticket_1.default.findAll({
                where: {
                    guild_id: { [sequelize_1.Op.eq]: gid },
                    user_id: { [sequelize_1.Op.eq]: uid },
                    status: { [sequelize_1.Op.eq]: 'open' },
                },
                order: [['id', 'DESC']],
                limit: 1,
            });
            return (_a = rows[0]) !== null && _a !== void 0 ? _a : null;
        });
    }
    /**
     * Resolve o ticket aberto do utilizador a partir da BD (fonte de verdade).
     * Usa ordenação por id DESC e, se o ORM não devolver linha, um SELECT explícito no Postgres
     * (útil com ENUM/casting ou dados legados com espaços em user_id).
     */
    getOpenTicketByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const uid = normalizeSnowflake(userId);
            if (!uid)
                return null;
            const rows = yield ticket_1.default.findAll({
                where: {
                    user_id: { [sequelize_1.Op.eq]: uid },
                    status: { [sequelize_1.Op.eq]: 'open' },
                },
                order: [['id', 'DESC']],
                limit: 1,
            });
            if (rows.length > 0)
                return rows[0];
            const raw = yield database_1.default.query(`SELECT id FROM tickets
       WHERE TRIM(user_id::text) = :uid AND status::text = 'open'
       ORDER BY id DESC
       LIMIT 1`, { replacements: { uid }, type: sequelize_1.QueryTypes.SELECT });
            const first = raw[0];
            if (!(first === null || first === void 0 ? void 0 : first.id))
                return null;
            return (_a = (yield ticket_1.default.findByPk(first.id))) !== null && _a !== void 0 ? _a : null;
        });
    }
    getTicketByChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ticket_1.default.findOne({ where: { channel_id: channelId, status: 'open' } });
        });
    }
    closeTicket(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updated] = yield ticket_1.default.update({ status: 'closed' }, { where: { channel_id: channelId, status: 'open' } });
            return updated > 0;
        });
    }
}
exports.default = new TicketService();
