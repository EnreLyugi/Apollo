import {
    ChannelType,
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandChannelOption,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { guildService } from "../../../../services";

export const channel = {
    data: new SlashCommandSubcommandBuilder()
        .setName('channel')
        .setNameLocalizations({
            "en-US": t('commands.twitch.subcommands.channel.name', 'en-US'),
            "pt-BR": t('commands.twitch.subcommands.channel.name', 'pt-BR')
        })
        .setDescription('Sets the Twitch notification channel')
        .setDescriptionLocalizations({
            "en-US": t('commands.twitch.subcommands.channel.description', 'en-US'),
            "pt-BR": t('commands.twitch.subcommands.channel.description', 'pt-BR')
        })
        .addChannelOption(new SlashCommandChannelOption()
            .setName('channel')
            .addChannelTypes(ChannelType.GuildText)
            .setNameLocalizations({
                "en-US": t('commands.twitch.subcommands.channel.options.channel.name', 'en-US'),
                "pt-BR": t('commands.twitch.subcommands.channel.options.channel.name', 'pt-BR')
            })
            .setDescription('Channel for Twitch live notifications')
            .setDescriptionLocalizations({
                "en-US": t('commands.twitch.subcommands.channel.options.channel.description', 'en-US'),
                "pt-BR": t('commands.twitch.subcommands.channel.options.channel.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const channel = interaction.options.getChannel('channel');
        if (!guild || !channel) return;

        const locale = mapLocale(interaction.locale);

        await guildService.setChannel('twitch_channel', guild.id, channel.id);

        await interaction.reply({
            content: t('commands.twitch.subcommands.channel.success', locale).replace('{channel}', `<#${channel.id}>`),
            flags: MessageFlags.Ephemeral,
        });
    },
};
