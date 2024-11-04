import client from "../../../client";
import musicClusterController, { ClusterData } from "../musicClusterController";

export const onClientDisconnect = async (guildId: string, channelId: string, cluster: ClusterData, playingChannel: string) => {
    const guild = client.guilds.resolve(guildId);
    if(!guild) return;

    console.log('Client Desconectado');

    const channel = guild.channels.resolve(channelId);
    if(!channel || !channel.isTextBased()) return;

    const ws = cluster.socket;

    const disconnectedChannelIndex = cluster.channels.findIndex(
        (ch) => ch.id === playingChannel
    );

    if (disconnectedChannelIndex !== -1) {
        cluster.channels.splice(disconnectedChannelIndex, 1);
    }

    if (cluster.channels.length === 0) {
        const response = {
            command: 'disconnect'
        };
        ws.send(JSON.stringify(response));

        musicClusterController.removeCluster(cluster.port);
    }
}