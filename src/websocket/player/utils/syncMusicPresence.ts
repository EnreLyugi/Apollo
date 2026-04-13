import { ActivityType, PresenceUpdateStatus } from 'discord.js';
import { VoiceConnectionStatus } from '@discordjs/voice';
import type { GuildQueue } from 'discord-player';
import client from '../../client';
import { getPlayer } from '..';

const MAX_ACTIVITY_NAME = 128;

function queueIsActivelyPlaying(queue: GuildQueue): boolean {
    const conn = queue.connection;
    if (!conn || conn.state.status !== VoiceConnectionStatus.Ready) return false;
    if (!queue.currentTrack) return false;
    if (queue.node.isPaused()) return false;
    return queue.node.isPlaying() || queue.node.isBuffering();
}

/** Online + “Listening” enquanto há fila a tocar em call; invisível (parece offline) caso contrário. */
export function syncMusicPresence(): void {
    if (!client.user) return;
    try {
        const player = getPlayer();
        let title: string | undefined;
        for (const queue of player.nodes.cache.values()) {
            if (queueIsActivelyPlaying(queue)) {
                title = queue.currentTrack?.title ?? undefined;
                break;
            }
        }
        if (title) {
            const name =
                title.length > MAX_ACTIVITY_NAME
                    ? `${title.slice(0, MAX_ACTIVITY_NAME - 3)}...`
                    : title;
            void client.user.setPresence({
                status: PresenceUpdateStatus.Online,
                activities: [{ name, type: ActivityType.Listening }],
            });
        } else {
            void client.user.setPresence({
                status: PresenceUpdateStatus.Invisible,
                activities: [],
            });
        }
    } catch {
        void client.user.setPresence({
            status: PresenceUpdateStatus.Invisible,
            activities: [],
        });
    }
}
