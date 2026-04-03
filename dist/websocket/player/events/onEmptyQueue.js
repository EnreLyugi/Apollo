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
exports.onEmptyQueue = void 0;
const localization_1 = require("../../../utils/localization");
const embed_1 = __importDefault(require("../../../models/embed"));
const config_1 = require("../../../config");
const socket_1 = require("../../socket");
const onEmptyQueue = (queue) => __awaiter(void 0, void 0, void 0, function* () {
    const data = queue.metadata;
    const { channelId, locale } = data;
    const ws = socket_1.sockets.get(data.wsId);
    if (!ws)
        return;
    const message = {
        event: 'queue_ended',
        guildId: queue.guild.id,
        channelId: data.channelId
    };
    ws.send(JSON.stringify(message));
    const guild = queue.guild;
    const channel = guild.channels.resolve(channelId);
    if (!channel)
        return;
    if (!channel.isTextBased())
        return;
    let response = new embed_1.default()
        .setColor(`#${config_1.colors.default_color}`)
        .setAuthor({ name: (0, localization_1.t)('player.events.queue_ended.title', locale) })
        .setDescription((0, localization_1.t)('player.events.queue_ended.description', locale));
    yield channel.send({ embeds: [response.build()] });
});
exports.onEmptyQueue = onEmptyQueue;
