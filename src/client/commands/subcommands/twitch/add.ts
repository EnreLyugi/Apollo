import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { addStreamer } from "../../../../services/twitchService";

export const add = {
    data: new SlashCommandSubcommandBuilder()
        .setName('add')
        .setNameLocalizations({
            "en-US": t('commands.twitch.subcommands.add.name', 'en-US'),
            "pt-BR": t('commands.twitch.subcommands.add.name', 'pt-BR')
        })
        .setDescription('Adds a Twitch streamer to monitor')
        .setDescriptionLocalizations({
            "en-US": t('commands.twitch.subcommands.add.description', 'en-US'),
            "pt-BR": t('commands.twitch.subcommands.add.description', 'pt-BR')
        })
        .addStringOption(new SlashCommandStringOption()
            .setName('username')
            .setNameLocalizations({
                "en-US": t('commands.twitch.subcommands.add.options.username.name', 'en-US'),
                "pt-BR": t('commands.twitch.subcommands.add.options.username.name', 'pt-BR')
            })
            .setDescription('Twitch username')
            .setDescriptionLocalizations({
                "en-US": t('commands.twitch.subcommands.add.options.username.description', 'en-US'),
                "pt-BR": t('commands.twitch.subcommands.add.options.username.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const username = interaction.options.getString('username')!;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const streamer = await addStreamer(guild.id, username);

        if (!streamer) {
            return interaction.editReply({
                content: t('commands.twitch.subcommands.add.not_found', locale).replace('{username}', username),
            });
        }

        await interaction.editReply({
            content: t('commands.twitch.subcommands.add.success', locale).replace('{username}', streamer.twitch_username),
        });
    },
};
