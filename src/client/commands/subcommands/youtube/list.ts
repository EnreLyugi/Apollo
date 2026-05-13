import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { getChannels } from "../../../../services/youtubeService";

export const list = {
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const channels = await getChannels(guild.id);

        if (channels.length === 0) {
            return interaction.reply({
                content: t("commands.youtube.subcommands.list.empty", locale),
                flags: MessageFlags.Ephemeral,
            });
        }

        const channelList = channels
            .map((c, i) => {
                let line = `${i + 1}. [${c.channel_name}](https://www.youtube.com/channel/${c.youtube_channel_id})`;
                if (c.custom_description?.trim()) {
                    line += ` _(${t("commands.youtube.subcommands.list.custom_text_badge", locale)})_`;
                }
                return line;
            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle(t("commands.youtube.subcommands.list.title", locale))
            .setDescription(channelList);

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        });
    },
};
