import {
    ChatInputCommandInteraction,
    MessageFlags,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { setTwitchStreamerDescription } from "../../../../services/twitchService";

export const setDescription = {
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const username = interaction.options.getString("username")!.trim();
        const raw = interaction.options.getString("custom_text");
        const clear = raw === null || raw.trim().length === 0;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const updated = await setTwitchStreamerDescription(
            guild.id,
            username,
            clear ? null : raw
        );

        if (!updated) {
            return interaction.editReply({
                content: t("commands.twitch.subcommands.set_description.not_found", locale).replace(
                    "{username}",
                    username
                ),
            });
        }

        const key = clear
            ? "commands.twitch.subcommands.set_description.cleared"
            : "commands.twitch.subcommands.set_description.success";
        await interaction.editReply({
            content: t(key, locale).replace("{username}", updated.twitch_username),
        });
    },
};
