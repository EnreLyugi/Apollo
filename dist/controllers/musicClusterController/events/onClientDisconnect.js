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
exports.onClientDisconnect = void 0;
const client_1 = __importDefault(require("../../../client"));
const musicClusterController_1 = __importDefault(require("../musicClusterController"));
const onClientDisconnect = (guildId, channelId, cluster, playingChannel) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = client_1.default.guilds.resolve(guildId);
    if (!guild)
        return;
    const channel = guild.channels.resolve(channelId);
    if (!channel || !channel.isTextBased())
        return;
    const ws = cluster.socket;
    const disconnectedChannelIndex = cluster.channels.findIndex((ch) => ch.id === playingChannel);
    if (disconnectedChannelIndex !== -1) {
        cluster.channels.splice(disconnectedChannelIndex, 1);
    }
    if (cluster.channels.length === 0) {
        const response = {
            command: 'disconnect'
        };
        ws.send(JSON.stringify(response));
        musicClusterController_1.default.removeCluster(cluster.port);
    }
});
exports.onClientDisconnect = onClientDisconnect;
