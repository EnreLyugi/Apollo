import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import { Embed } from "../../models/";
import { xpRoleService } from "../../services";
import { mapLocale, t, format } from "../../utils/localization";
import { colors } from "../../config";
import { CommandCategory } from "./help";

export const listXpRoles = {
    data: new SlashCommandBuilder()
        .setName("listxproles")
        .setNameLocalizations({
            "en-US": t("commands.listxproles.name", "en-US"),
            "pt-BR": t("commands.listxproles.name", "pt-BR"),
        })
        .setDescription(t("commands.listxproles.description", "en-US"))
        .setDescriptionLocalizations({
            "en-US": t("commands.listxproles.description", "en-US"),
            "pt-BR": t("commands.listxproles.description", "pt-BR"),
        }),
    category: CommandCategory.XP,
    usage: "/listxproles",
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const rows = await xpRoleService.listRolesByGuild(guild.id);

        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
            .setTitle(t("commands.listxproles.response.title", locale))
            .setTimestamp(new Date());

        if (rows.length === 0) {
            embed.setDescription(
                t("commands.listxproles.response.empty", locale),
            );
            return interaction.reply({ embeds: [embed.build()] });
        }

        const lines = rows.map((row) => {
            const discordRole = guild.roles.resolve(row.role_id);
            const roleLabel = discordRole ? `${discordRole}` : `\`${row.role_id}\``;
            return format(t("commands.listxproles.response.line", locale), {
                role: roleLabel,
                level: row.level,
                xp: row.xp,
            });
        });

        let body = lines.join("\n");
        const maxLen = 3900;
        if (body.length > maxLen) {
            body =
                body.slice(0, maxLen) +
                "\n… " +
                t("commands.listxproles.response.truncated", locale);
        }
        embed.setDescription(body);

        return interaction.reply({ embeds: [embed.build()] });
    },
};
