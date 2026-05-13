import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { getStreamers } from "../../../../services/twitchService";

export const list = {
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const streamers = await getStreamers(guild.id);

        if (streamers.length === 0) {
            return interaction.reply({
                content: t("commands.twitch.subcommands.list.empty", locale),
                flags: MessageFlags.Ephemeral,
            });
        }

        const streamerList = streamers
            .map((s, i) => {
                let line = `${i + 1}. [${s.twitch_username}](https://twitch.tv/${s.twitch_username})`;
                if (s.custom_description?.trim()) {
                    line += ` _(${t("commands.twitch.subcommands.list.custom_text_badge", locale)})_`;
                }
                return line;
            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor(0x9146ff)
            .setTitle(t("commands.twitch.subcommands.list.title", locale))
            .setDescription(streamerList);

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        });
    },
};
