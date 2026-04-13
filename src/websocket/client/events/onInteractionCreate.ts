import { Interaction } from 'discord.js';
import { QueueData } from '../../player/events/types';
import { getPlayer } from '../../player';

export const onInteractionCreate = async (interaction: Interaction) => {
    if (interaction.isButton()) {
        const guild = interaction.guild;
        if (!guild) return;

        const player = getPlayer();
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
    }
};
