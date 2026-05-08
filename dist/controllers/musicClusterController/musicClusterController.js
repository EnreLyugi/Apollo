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
const ws_1 = __importDefault(require("ws"));
const events_1 = require("./events");
const client_1 = __importDefault(require("../../client"));
class MusicClusterController {
    constructor() {
        this.clusters = [];
        // First add all CLUSTER environment variables in order
        this.availableSockets = Object.keys(process.env)
            .filter(key => key.startsWith('CLUSTER'))
            .sort() // Sort to ensure consistent order (CLUSTER1, CLUSTER2, etc)
            .map(key => ({
            port: process.env[key],
            client_id: process.env[`${key}_ID`] || 'default'
        }));
        // Then add WS_PORT if it exists
        if (process.env.WS_PORT) {
            this.availableSockets.push({
                port: process.env.WS_PORT,
                client_id: process.env.DISCORD_CLIENT_ID || 'default'
            });
        }
    }
    isSocketAvailable(port, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const socket = new ws_1.default(`ws://localhost:${port}`);
                const available = yield new Promise((resolve) => {
                    const timeout = setTimeout(() => {
                        socket.close();
                        resolve(false);
                    }, 3000);
                    socket.on("open", () => {
                        socket.send(JSON.stringify({
                            command: 'check_availability',
                            guildId
                        }));
                    });
                    socket.on("message", (message) => {
                        try {
                            const data = JSON.parse(message.toString());
                            if (data.event === 'availability_response') {
                                clearTimeout(timeout);
                                socket.close();
                                resolve(data.available);
                            }
                        }
                        catch (error) {
                            console.error('Error processing message:', error);
                        }
                    });
                    socket.on("error", (error) => {
                        console.error('Error connecting:', error.message);
                        clearTimeout(timeout);
                        resolve(false);
                    });
                });
                return available;
            }
            catch (error) {
                console.error('Exception while trying to connect:', error);
                return false;
            }
        });
    }
    getClusterForGuild(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            // Filter only clusters that are actively playing in the server
            const usedPorts = this.clusters
                .filter(cluster => cluster.channels.length > 0) // Only consider clusters with active channels
                .filter(cluster => cluster.channels.some(channel => {
                // Check if the bot is still in the guild and channel
                const guildStillExists = client_1.default.guilds.cache.has(channel.guild.id);
                const channelStillExists = guildStillExists && channel.guild.channels.cache.has(channel.id);
                return channelStillExists && channel.guild === guild;
            }))
                .map(cluster => cluster.port);
            // Find the first available socket that's not in use and has the bot in the guild
            for (const { port, client_id } of this.availableSockets) {
                const isAvailable = yield this.isSocketAvailable(port, guild.id);
                if (!usedPorts.includes(port) && isAvailable) {
                    return port;
                }
            }
            return undefined;
        });
    }
    getCluster(channel) {
        return this.clusters.find(cluster => cluster.channels.some(ch => ch === channel));
    }
    setupSockectEvents(cluster) {
        const ws = cluster.socket;
        ws.on('message', message => {
            const data = JSON.parse(message.toString());
            const { guildId, channelId, playingChannel } = data;
            if (data.event == 'client_disconnected')
                return (0, events_1.onClientDisconnect)(guildId, channelId, cluster, playingChannel);
        });
    }
    removeCluster(port) {
        this.clusters = this.clusters.filter(cluster => cluster.port !== port);
    }
    instantiateCluster(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = channel.guild;
            let clusterData = this.getCluster(channel);
            if (!clusterData) {
                const port = yield this.getClusterForGuild(guild);
                if (!port) {
                    console.error(`All clusters are unavailable for Server ${guild.id}.`);
                    return null;
                }
                const socket = new ws_1.default(`ws://localhost:${port}`);
                const connectionPromise = new Promise((resolve, reject) => {
                    socket.on("open", () => {
                        socket.send(JSON.stringify({ command: 'connect' }));
                    });
                    socket.on("message", (message) => {
                        const data = JSON.parse(message.toString());
                        if (data.event === 'connected') {
                            resolve(socket);
                        }
                    });
                    socket.on("error", (err) => {
                        console.error(`WebSocket error on port ${port}:`, err);
                        reject(err);
                    });
                });
                socket.on("close", () => {
                    this.removeCluster(port);
                });
                try {
                    const connectedSocket = yield connectionPromise;
                    clusterData = {
                        port,
                        socket: connectedSocket,
                        channels: []
                    };
                    this.clusters.push(clusterData);
                    this.setupSockectEvents(clusterData);
                }
                catch (error) {
                    console.error('Error connecting to cluster:', error);
                    return null;
                }
            }
            if (!clusterData.channels.includes(channel)) {
                clusterData.channels.push(channel);
            }
            return clusterData.socket;
        });
    }
}
const musicClusterController = new MusicClusterController();
exports.default = musicClusterController;
