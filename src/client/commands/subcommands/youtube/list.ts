import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { getChannels } from "../../../../services/youtubeService";

export const list = {
    data: new SlashCommandSubcommandBuilder()
        .setName('list')
        .setNameLocalizations({
            "en-US": t('commands.youtube.subcommands.list.name', 'en-US'),
            "pt-BR": t('commands.youtube.subcommands.list.name', 'pt-BR')
        })
        .setDescription('Lists monitored YouTube channels')
        .setDescriptionLocalizations({
            "en-US": t('commands.youtube.subcommands.list.description', 'en-US'),
            "pt-BR": t('commands.youtube.subcommands.list.description', 'pt-BR')
        }),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const channels = await getChannels(guild.id);

        if (channels.length === 0) {
            return interaction.reply({
                content: t('commands.youtube.subcommands.list.empty', locale),
                flags: MessageFlags.Ephemeral,
            });
        }

        const channelList = channels
            .map((c, i) => `${i + 1}. [${c.channel_name}](https://www.youtube.com/channel/${c.youtube_channel_id})`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(t('commands.youtube.subcommands.list.title', locale))
            .setDescription(channelList);

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        });
    },
};
