import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { Embed } from '../../models/'
import { commands } from './';
import { mapLocale, t, format } from "../../utils/localization";

export const help = {
    data: new SlashCommandBuilder()
        .setName('help'),
    usage: '/help <command(optional)>',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const embeds: any[] = [];
        commands.forEach(command => {

            const locale = mapLocale(interaction.locale);
            const info = format(t('commands.help.template', locale), {
                commandDescription: command.data.description_localizations && command.data.description_localizations[interaction.locale] || command.data.description,
                commandUsage: t(`commands.${command.data.name}.usage`, locale),
            });

            embeds.push(new Embed()
                .setTitle(t(`commands.${command.data.name}.name`, locale))
                .setDescription(info)
                .build()
            );
        })

        await interaction.reply({ embeds, ephemeral: true });
    },
};