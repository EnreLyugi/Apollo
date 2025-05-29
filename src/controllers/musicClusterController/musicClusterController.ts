import { Guild, VoiceBasedChannel } from 'discord.js';
import WebSocket from "ws";
import { onClientDisconnect } from './events';
import client from '../../client';

export interface ClusterData {
    port: string;
    socket: WebSocket;
    channels: VoiceBasedChannel[];
}

class MusicClusterController {
    private clusters: ClusterData[] = [];
    private availableSockets: { port: string, client_id: string }[];

    constructor() {
        // First add all CLUSTER environment variables in order
        this.availableSockets = Object.keys(process.env)
            .filter(key => key.startsWith('CLUSTER'))
            .sort() // Sort to ensure consistent order (CLUSTER1, CLUSTER2, etc)
            .map(key => ({
                port: process.env[key] as string,
                client_id: process.env[`${key}_ID`] || 'default'
            }));

        // Then add WS_PORT if it exists
        if (process.env.WS_PORT) {
            this.availableSockets.push({
                port: process.env.WS_PORT as string,
                client_id: process.env.DISCORD_CLIENT_ID || 'default'
            });
        }
    }

    private async isSocketAvailable(port: string, guildId: string): Promise<boolean> {
        try {
            const socket = new WebSocket(`ws://localhost:${port}`);
            
            const available = await new Promise<boolean>((resolve) => {
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
                    } catch (error) {
                        console.error('Erro ao processar mensagem:', error);
                    }
                });

                socket.on("error", (error) => {
                    console.error('Erro ao conectar:', error.message);
                    clearTimeout(timeout);
                    resolve(false);
                });
            });

            return available;
        } catch (error) {
            console.error('Exceção ao tentar conectar:', error);
            return false;
        }
    }

    private async getClusterForGuild(guild: Guild): Promise<string | undefined> {
        // Filtra apenas clusters que estão ativamente tocando no servidor
        const usedPorts = this.clusters
            .filter(cluster => cluster.channels.length > 0) // Só considera clusters que têm canais ativos
            .filter(cluster => cluster.channels.some(channel => {
                // Check if the bot is still in the guild and channel
                const guildStillExists = client.guilds.cache.has(channel.guild.id);
                const channelStillExists = guildStillExists && channel.guild.channels.cache.has(channel.id);
                return channelStillExists && channel.guild === guild;
            }))
            .map(cluster => cluster.port);

        // Find the first available socket that's not in use and has the bot in the guild
        for (const { port, client_id } of this.availableSockets) {
            const isAvailable = await this.isSocketAvailable(port, guild.id);
            
            if (!usedPorts.includes(port) && isAvailable) {
                return port;
            }
        }

        return undefined;
    }

    private getCluster(channel: VoiceBasedChannel): ClusterData | undefined {
        return this.clusters.find(cluster => cluster.channels.some(ch => ch === channel));
    }

    private setupSockectEvents(cluster: ClusterData) {
        const ws = cluster.socket
        ws.on('message', message => {
            const data = JSON.parse(message.toString());
            const { guildId, channelId, playingChannel } = data
            if(data.event == 'client_disconnected') return onClientDisconnect(guildId, channelId, cluster, playingChannel)
        });
    }

    public removeCluster(port: string) {
        this.clusters = this.clusters.filter(cluster => cluster.port !== port);
    }

    public async instantiateCluster(channel: VoiceBasedChannel): Promise<WebSocket | null> {
        const guild = channel.guild;

        let clusterData = this.getCluster(channel);

        if(!clusterData) {
            const port = await this.getClusterForGuild(guild);

            if(!port) {
                console.error(`Todos os clusters estão indisponíveis para o Servidor ${guild.id}.`);
                return null;
            }

            const socket = new WebSocket(`ws://localhost:${port}`);

            const connectionPromise = new Promise<WebSocket>((resolve, reject) => {
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
                    console.error(`Erro no WebSocket para a porta ${port}:`, err);
                    reject(err);
                });
            });

            socket.on("close", () => {
                this.removeCluster(port);
            });

            try {
                const connectedSocket = await connectionPromise;

                clusterData = {
                    port,
                    socket: connectedSocket,
                    channels: []
                };

                this.clusters.push(clusterData);
                this.setupSockectEvents(clusterData);
            } catch (error) {
                console.error('Erro ao conectar ao cluster:', error);
                return null;
            }
        }

        if (!clusterData.channels.includes(channel)) {
            clusterData.channels.push(channel);
        }

        return clusterData.socket;
    }
}

const musicClusterController = new MusicClusterController();
export default musicClusterController;