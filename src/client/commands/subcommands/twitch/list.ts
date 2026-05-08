import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { getStreamers } from "../../../../services/twitchService";

export const list = {
    data: new SlashCommandSubcommandBuilder()
        .setName('list')
        .setNameLocalizations({
            "en-US": t('commands.twitch.subcommands.list.name', 'en-US'),
            "pt-BR": t('commands.twitch.subcommands.list.name', 'pt-BR')
        })
        .setDescription('Lists monitored Twitch streamers')
        .setDescriptionLocalizations({
            "en-US": t('commands.twitch.subcommands.list.description', 'en-US'),
            "pt-BR": t('commands.twitch.subcommands.list.description', 'pt-BR')
        }),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const streamers = await getStreamers(guild.id);

        if (streamers.length === 0) {
            return interaction.reply({
                content: t('commands.twitch.subcommands.list.empty', locale),
                flags: MessageFlags.Ephemeral,
            });
        }

        const streamerList = streamers
            .map((s, i) => `${i + 1}. [${s.twitch_username}](https://twitch.tv/${s.twitch_username})`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor(0x9146FF)
            .setTitle(t('commands.twitch.subcommands.list.title', locale))
            .setDescription(streamerList);

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        });
    },
};
