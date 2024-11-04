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
        this.availableSockets = Object.keys(process.env)
            .filter(key => key.startsWith('CLUSTER'))
            .map(key => ({
                port: process.env[key] as string,
                client_id: process.env[`${key}_ID`] as string
            }));

         if (process.env.WS_PORT) {
            this.availableSockets.push({
                port: process.env.WS_PORT as string,
                client_id: process.env.DISCORD_CLIENT_ID as string || "default"
            });
        }
    }

    private getClusterForGuild(guild: Guild): string | undefined {
        const usedPorts = this.clusters
            .filter(cluster => cluster.channels.some(channel => channel.guild === guild))
            .map(cluster => cluster.port);

        const available = this.availableSockets.find(({ port, client_id }) => 
            !usedPorts.includes(port)
        );

        return available?.port;
    }

    private getCluster(channel: VoiceBasedChannel): ClusterData | undefined {
        return this.clusters.find(cluster => cluster.channels.some(ch => ch === channel));
    }

    private setupSockectEvents(cluster: ClusterData) {
        const ws = cluster.socket
        ws.on('message', message => {
            console.log('message received')
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
            const port = this.getClusterForGuild(guild);

            console.log(`Sockets disponíveis: ${this.availableSockets}`);
            console.log(`Tentativa de uso do socket: ${port}`);

            if(!port) {
                console.log(`Todos os clusters já estão em uso para a guild ${guild.id}.`);
                return null;
            }

            const socket = new WebSocket(`ws://localhost:${port}`);

            const connectionPromise = new Promise<WebSocket>((resolve, reject) => {
                socket.on("open", () => {
                    console.log(`Conectado ao WebSocket na porta ${port}`);
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
                console.log(`WebSocket desconectado para a porta ${port}`);
                this.removeCluster(port);
            });

            console.log(port);

            clusterData = { port, socket: await connectionPromise, channels: [ channel ] };
            this.clusters.push(clusterData);
        } else {

            if (!clusterData.channels.some((ch) => ch.id === channel.id)) {
                clusterData.channels.push(channel);
            }
        }

        this.setupSockectEvents(clusterData);
        return clusterData.socket;
    }
}

export default new MusicClusterController();