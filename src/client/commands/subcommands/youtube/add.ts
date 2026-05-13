import {
    ChatInputCommandInteraction,
    MessageFlags,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { addChannel } from "../../../../services/youtubeService";

export const add = {
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const query = interaction.options.getString("channel")!.trim();
        const customText = interaction.options.getString("custom_text");

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const channel = await addChannel(guild.id, query, customText);

        if (!channel) {
            return interaction.editReply({
                content: t("commands.youtube.subcommands.add.not_found", locale).replace(
                    "{channel}",
                    query
                ),
            });
        }

        await interaction.editReply({
            content: t("commands.youtube.subcommands.add.success", locale).replace(
                "{channel}",
                channel.channel_name
            ),
        });
    },
};
