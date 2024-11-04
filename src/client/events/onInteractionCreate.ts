import { Interaction } from "discord.js";
import { commands } from '../commands';
import { modals } from '../modals';
import { t, mapLocale } from '../../utils/localization';
import { QueueData } from "../../player/events/types";
import { pausedButtons, unpausedButtons } from "../../player/components";

export const onInteractionCreate = async (interaction: Interaction) => {
    const commandMap = new Map();
    commands.forEach(command => commandMap.set(command.data.name, command));

    const modalsMap = new Map();
    modals.forEach(modal => modalsMap.set(modal.data.name, modal));

    const locale = mapLocale(interaction.locale);

    if (interaction.isModalSubmit()) {
        const modalName = interaction.customId;
        const modal = modalsMap.get(modalName);

        if (!modal) return console.log(`\x1b[32m%s\x1b[0m`, `Modal ${modalName} not found!`);
            
        try {
            await modal.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: t(`client.error_on_command`, locale), ephemeral: true });
        }
    }

    if (interaction.isChatInputCommand()) {
        const commandName = interaction.commandName;
        const command = commandMap.get(commandName);
        if (!command) return console.log(`\x1b[32m%s\x1b[0m`, `Command ${commandName} not found!`);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            await interaction.reply({ content: t(`client.error_on_command`, locale), ephemeral: true });
        }
    }
};