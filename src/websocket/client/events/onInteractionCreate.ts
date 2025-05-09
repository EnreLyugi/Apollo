import { Interaction } from "discord.js";
import { QueueData } from "../../player/events/types";
import { pausedButtons, unpausedButtons } from "../../player/components";
import { useMainPlayer } from "discord-player";

export const onInteractionCreate = async (interaction: Interaction) => {
    if(interaction.isButton()) {
        const guild = interaction.guild;
        if(!guild) return;
        
        const player = useMainPlayer();
        const queue = player.nodes.get(guild.id);

        if (!queue) return interaction.message.delete().catch((e) => {});
        if (!queue.currentTrack) return;

        const queueData = queue.metadata as QueueData;

        if(interaction.message.id != queueData.currentMessage.id) return interaction.message.delete().catch((e) => {});

        if(guild.members.me?.voice.channel != guild.members.resolve(interaction.user.id)?.voice.channel) return;

        switch(interaction.customId) {
            case 'rewindButton':
                queue.node.seek(100);
                break;

            case 'pauseButton':
                queue.node.pause();
                await interaction.update({ components: [ pausedButtons as any ] });
                break;

            case 'unpauseButton':
                queue.node.resume();
                await interaction.update({ components: [ unpausedButtons as any ] });
                break;

            case 'skipButton':
                queue.node.skip();
                break;
            default:
                return;
        }
    }
};