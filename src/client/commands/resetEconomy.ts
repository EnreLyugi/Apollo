import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { Embed } from "../../models";
import { memberService, userColorService } from "../../services";
import { mapLocale, t, format } from "../../utils/localization";
import { colors } from "../../config";
import { CommandCategory } from "./help";

export const resetEconomy = {
    data: new SlashCommandBuilder()
        .setName("reseteconomy")
        .setNameLocalizations({
            "en-US": t("commands.reseteconomy.name", "en-US"),
            "pt-BR": t("commands.reseteconomy.name", "pt-BR"),
        })
        .setDescription("Reset all coins and color purchases in this server (admin only)")
        .setDescriptionLocalizations({
            "en-US": t("commands.reseteconomy.description", "en-US"),
            "pt-BR": t("commands.reseteconomy.description", "pt-BR"),
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    category: CommandCategory.ECONOMY,
    usage: "/reseteconomy",
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const colorRows = await userColorService.getAllForGuild(guild.id);
        const byUser = new Map<string, string[]>();
        for (const row of colorRows) {
            const list = byUser.get(row.user_id) ?? [];
            list.push(row.role_id);
            byUser.set(row.user_id, list);
        }

        let membersStripped = 0;
        for (const [userId, roleIds] of byUser) {
            const gm = await guild.members.fetch(userId).catch(() => null);
            if (!gm) continue;
            const uniqueRoles = [...new Set(roleIds)];
            await gm.roles.remove(uniqueRoles).catch(() => {});
            membersStripped++;
        }

        const purchasesRemoved = await userColorService.deleteAllForGuild(guild.id);
        const coinsResetRows = await memberService.resetCoinsForGuild(guild.id);

        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t("commands.reseteconomy.response.title", locale))
            .setDescription(
                format(t("commands.reseteconomy.response.body", locale), {
                    purchases: String(purchasesRemoved),
                    members_colors: String(membersStripped),
                    members_coins: String(coinsResetRows),
                })
            )
            .setTimestamp(new Date());

        await interaction.editReply({ embeds: [embed.build()] });
    },
};
