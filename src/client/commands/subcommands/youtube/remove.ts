import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { removeChannel } from "../../../../services/youtubeService";

export const remove = {
    data: new SlashCommandSubcommandBuilder()
        .setName('remove')
        .setNameLocalizations({
            "en-US": t('commands.youtube.subcommands.remove.name', 'en-US'),
            "pt-BR": t('commands.youtube.subcommands.remove.name', 'pt-BR')
        })
        .setDescription('Removes a YouTube channel from monitoring')
        .setDescriptionLocalizations({
            "en-US": t('commands.youtube.subcommands.remove.description', 'en-US'),
            "pt-BR": t('commands.youtube.subcommands.remove.description', 'pt-BR')
        })
        .addStringOption(new SlashCommandStringOption()
            .setName('channel')
            .setNameLocalizations({
                "en-US": t('commands.youtube.subcommands.remove.options.channel.name', 'en-US'),
                "pt-BR": t('commands.youtube.subcommands.remove.options.channel.name', 'pt-BR')
            })
            .setDescription('YouTube channel name to remove')
            .setDescriptionLocalizations({
                "en-US": t('commands.youtube.subcommands.remove.options.channel.description', 'en-US'),
                "pt-BR": t('commands.youtube.subcommands.remove.options.channel.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const channelName = interaction.options.getString('channel')!;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const removed = await removeChannel(guild.id, channelName);

        if (!removed) {
            return interaction.editReply({
                content: t('commands.youtube.subcommands.remove.not_found', locale).replace('{channel}', channelName),
            });
        }

        await interaction.editReply({
            content: t('commands.youtube.subcommands.remove.success', locale).replace('{channel}', channelName),
        });
    },
};
