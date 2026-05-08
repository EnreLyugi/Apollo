import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { addChannel } from "../../../../services/youtubeService";

export const add = {
    data: new SlashCommandSubcommandBuilder()
        .setName('add')
        .setNameLocalizations({
            "en-US": t('commands.youtube.subcommands.add.name', 'en-US'),
            "pt-BR": t('commands.youtube.subcommands.add.name', 'pt-BR')
        })
        .setDescription('Adds a YouTube channel to monitor')
        .setDescriptionLocalizations({
            "en-US": t('commands.youtube.subcommands.add.description', 'en-US'),
            "pt-BR": t('commands.youtube.subcommands.add.description', 'pt-BR')
        })
        .addStringOption(new SlashCommandStringOption()
            .setName('channel')
            .setNameLocalizations({
                "en-US": t('commands.youtube.subcommands.add.options.channel.name', 'en-US'),
                "pt-BR": t('commands.youtube.subcommands.add.options.channel.name', 'pt-BR')
            })
            .setDescription('YouTube channel name, @handle or ID')
            .setDescriptionLocalizations({
                "en-US": t('commands.youtube.subcommands.add.options.channel.description', 'en-US'),
                "pt-BR": t('commands.youtube.subcommands.add.options.channel.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const query = interaction.options.getString('channel')!;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const channel = await addChannel(guild.id, query);

        if (!channel) {
            return interaction.editReply({
                content: t('commands.youtube.subcommands.add.not_found', locale).replace('{channel}', query),
            });
        }

        await interaction.editReply({
            content: t('commands.youtube.subcommands.add.success', locale).replace('{channel}', channel.channel_name),
        });
    },
};
