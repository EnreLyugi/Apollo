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
exports.onReady = void 0;
const discord_js_1 = require("discord.js");
const services_1 = require("../../services");
const node_cron_1 = __importDefault(require("node-cron"));
const controllers_1 = require("../../controllers");
const onReady = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(`\x1b[34m%s\x1b[0m`, `\nBot started!\n\nUsers: ${client.users.cache.size} \nServers: ${client.guilds.cache.size}\n`);
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({ activities: [{ name: `in ${client.guilds.cache.size} Servers` }], status: discord_js_1.PresenceUpdateStatus.Online });
    (yield client.guilds.fetch()).forEach((guild) => __awaiter(void 0, void 0, void 0, function* () {
        yield services_1.guildService.createGuildIfNotExists(guild.id);
    }));
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield controllers_1.BirthdayController.removeBirthdayRoles();
            yield controllers_1.BirthdayController.notifyBirthdays();
            const user = client.users.resolve('1245127937259208808');
            if (user)
                yield user.send('Rodou o cron agora!');
        }
        catch (err) {
            console.error('[CRON] Erro ao rodar cron diário:', err);
        }
    }), {
        timezone: "America/Sao_Paulo"
    });
});
exports.onReady = onReady;
