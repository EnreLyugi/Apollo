import { Interaction } from "discord.js";
import { t, mapLocale } from '../../../utils/localization';
import player from "../../player";
import { QueueData } from "../../player/events/types";
import { pausedButtons, unpausedButtons } from "../../player/components";

export const onInteractionCreate = async (interaction: Interaction) => {
    if(interaction.isButton()) {
        const guild = interaction.guild;
        if(!guild) return;
        
        const guildQueue = await player.getQueue(guild.id);
        if (!guildQueue) return interaction.message.delete().catch((e) => {});
        if (!guildQueue.nowPlaying) return;

        const queueData = guildQueue.data as QueueData;

        if(interaction.message.id != queueData.currentMessage.id) return interaction.message.delete().catch((e) => {});

        if(guild.members.me?.voice.channel != guild.members.resolve(interaction.user.id)?.voice.channel) return;

        if(interaction.customId == "rewindButton") {
            guildQueue.seek(100);

            await interaction.update({ components: [ unpausedButtons as any ] });
        }

        if (interaction.customId == "pauseButton") {
            guildQueue.setPaused(true);

            await interaction.update({ components: [ pausedButtons as any ] });
        }

        if (interaction.customId == "unpauseButton") {
            guildQueue.setPaused(false);
        
            await interaction.update({ components: [ unpausedButtons as any ] });
        }

        if (interaction.customId == "skipButton") {
            console.log('sinal de skip recebido');
            guildQueue.skip();
        }
    }
};