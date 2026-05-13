import {
    ChatInputCommandInteraction,
    MessageFlags,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { removeChannel } from "../../../../services/youtubeService";

export const remove = {
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const channelName = interaction.options.getString("channel")!.trim();

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const removed = await removeChannel(guild.id, channelName);

        if (!removed) {
            return interaction.editReply({
                content: t("commands.youtube.subcommands.remove.not_found", locale).replace(
                    "{channel}",
                    channelName
                ),
            });
        }

        await interaction.editReply({
            content: t("commands.youtube.subcommands.remove.success", locale).replace(
                "{channel}",
                channelName
            ),
        });
    },
};
