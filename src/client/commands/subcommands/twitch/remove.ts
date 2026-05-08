import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { removeStreamer } from "../../../../services/twitchService";

export const remove = {
    data: new SlashCommandSubcommandBuilder()
        .setName('remove')
        .setNameLocalizations({
            "en-US": t('commands.twitch.subcommands.remove.name', 'en-US'),
            "pt-BR": t('commands.twitch.subcommands.remove.name', 'pt-BR')
        })
        .setDescription('Removes a Twitch streamer from monitoring')
        .setDescriptionLocalizations({
            "en-US": t('commands.twitch.subcommands.remove.description', 'en-US'),
            "pt-BR": t('commands.twitch.subcommands.remove.description', 'pt-BR')
        })
        .addStringOption(new SlashCommandStringOption()
            .setName('username')
            .setNameLocalizations({
                "en-US": t('commands.twitch.subcommands.remove.options.username.name', 'en-US'),
                "pt-BR": t('commands.twitch.subcommands.remove.options.username.name', 'pt-BR')
            })
            .setDescription('Twitch username to remove')
            .setDescriptionLocalizations({
                "en-US": t('commands.twitch.subcommands.remove.options.username.description', 'en-US'),
                "pt-BR": t('commands.twitch.subcommands.remove.options.username.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const username = interaction.options.getString('username')!;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const removed = await removeStreamer(guild.id, username.toLowerCase());

        if (!removed) {
            return interaction.editReply({
                content: t('commands.twitch.subcommands.remove.not_found', locale).replace('{username}', username),
            });
        }

        await interaction.editReply({
            content: t('commands.twitch.subcommands.remove.success', locale).replace('{username}', username),
        });
    },
};
