import { REST, Routes } from "discord.js";
import { commands } from '../client/commands/';
import { getCommandDescriptions, getCommandNames } from "./localization";

export const loadApplicationCommands = async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN || '');
    console.log('Started refreshing application (/) commands.');

    const commandList: object[] = [];

    commands.forEach(command => {
        const { data } = command
        const commandNames = getCommandNames(data.name || '');
        const commandDescriptions = getCommandDescriptions(data.name || '');
        data.setDescription(commandDescriptions["en-US"] ?? '')
            .setNameLocalizations(commandNames)
            .setDescriptionLocalizations(commandDescriptions)
        commandList.push(command.data);
    })

    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || ''), { body: commandList })
        .then(() => {
            console.log('Successfully reloaded application (/) commands.');
        })
        .catch((err) => {
            throw new Error(err)
        });
}