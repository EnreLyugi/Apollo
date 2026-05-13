import {
    ChatInputCommandInteraction,
    MessageFlags,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { setYoutubeChannelDescription } from "../../../../services/youtubeService";

export const setDescription = {
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const channelQuery = interaction.options.getString("channel")!.trim();
        const raw = interaction.options.getString("custom_text");
        const clear = raw === null || raw.trim().length === 0;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const updated = await setYoutubeChannelDescription(
            guild.id,
            channelQuery,
            clear ? null : raw
        );

        if (!updated) {
            return interaction.editReply({
                content: t("commands.youtube.subcommands.set_description.not_found", locale).replace(
                    "{channel}",
                    channelQuery
                ),
            });
        }

        const key = clear
            ? "commands.youtube.subcommands.set_description.cleared"
            : "commands.youtube.subcommands.set_description.success";
        await interaction.editReply({
            content: t(key, locale).replace("{channel}", updated.channel_name),
        });
    },
};
