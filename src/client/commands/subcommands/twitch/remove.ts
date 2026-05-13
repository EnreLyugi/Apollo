import {
    ChatInputCommandInteraction,
    MessageFlags,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { removeStreamer } from "../../../../services/twitchService";

export const remove = {
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const username = interaction.options.getString("username")!.trim();

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const removed = await removeStreamer(guild.id, username.toLowerCase());

        if (!removed) {
            return interaction.editReply({
                content: t("commands.twitch.subcommands.remove.not_found", locale).replace(
                    "{username}",
                    username
                ),
            });
        }

        await interaction.editReply({
            content: t("commands.twitch.subcommands.remove.success", locale).replace(
                "{username}",
                username
            ),
        });
    },
};
