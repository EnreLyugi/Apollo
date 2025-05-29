import { ModalSubmitInteraction } from "discord.js";
import { welcomeSettingsService } from "../../services";

export const welcomeSettings = {
    data: {
        name: 'welcomeSettings'
    },
    execute: async(interaction: ModalSubmitInteraction) => {
        const channelId = interaction.fields.getTextInputValue('channelId');
        const title = interaction.fields.getTextInputValue('welcomeTitle');
        const description = interaction.fields.getTextInputValue('welcomeDescription');
        const image = interaction.fields.getTextInputValue('welcomeImage');

        const guild = interaction.guild;
        if(!guild) return interaction.reply({
            content: 'Erro!',
            ephemeral: true,
        });

        const channel = guild.channels.resolve(channelId);
        if(!channel) return interaction.reply({
            content: 'Invalid Channel!',
            ephemeral: true,
        });

        await welcomeSettingsService.saveSettings(channel.id, guild.id, title, description, image);

        await interaction.reply({
        content: 'Configurações de boas-vindas salvas com sucesso!',
        ephemeral: true,
        });
    }
};