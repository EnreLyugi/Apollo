import { Interaction } from 'discord.js';
import type { QueueData } from '../../websocket/player/events/types';

/** Botões do painel do player (discord-player). Import dinâmico evita ciclo client ↔ player na inicialização. */
export const onPlayerButtonInteraction = async (interaction: Interaction) => {
    if (!interaction.isButton()) return;
    const guild = interaction.guild;
    if (!guild) return;

    let getPlayer: typeof import('../../websocket/player').getPlayer;
    try {
        ({ getPlayer } = await import('../../websocket/player'));
    } catch {
        return;
    }

    let player;
    try {
        player = getPlayer();
    } catch {
        return;
    }

    const queue = player.nodes.get(guild.id);

    if (!queue) return interaction.message.delete().catch(() => {});
    if (!queue.currentTrack) return;

    const data = queue.metadata as QueueData;
    const pm = data.playerMessage;

    if (interaction.message.id !== data.currentMessage.id) return interaction.message.delete().catch(() => {});
    if (guild.members.me?.voice.channel !== guild.members.resolve(interaction.user.id)?.voice.channel) return;

    switch (interaction.customId) {
        case 'rewindButton':
            queue.node.seek(100);
            await pm.setState('playing', queue, true);
            await interaction.update(pm.getInteractionPayload());
            break;

        case 'pauseButton':
            queue.node.pause();
            await pm.setState('paused', queue, true);
            await interaction.update(pm.getInteractionPayload());
            break;

        case 'unpauseButton':
            queue.node.resume();
            await pm.setState('playing', queue, true);
            await interaction.update(pm.getInteractionPayload());
            break;

        case 'skipButton':
            await interaction.deferUpdate();
            queue.node.skip();
            break;

        default:
            return;
    }
};
