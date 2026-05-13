import {
    ChatInputCommandInteraction,
    MessageFlags,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { addStreamer } from "../../../../services/twitchService";

export const add = {
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const username = interaction.options.getString("username")!.trim();
        const customText = interaction.options.getString("custom_text");

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const streamer = await addStreamer(guild.id, username, customText);

        if (!streamer) {
            return interaction.editReply({
                content: t("commands.twitch.subcommands.add.not_found", locale).replace(
                    "{username}",
                    username
                ),
            });
        }

        await interaction.editReply({
            content: t("commands.twitch.subcommands.add.success", locale).replace(
                "{username}",
                streamer.twitch_username
            ),
        });
    },
};
