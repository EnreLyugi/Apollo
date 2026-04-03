import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { Embed } from "../../models/";
import Member from "../../models/member";
import { xpService } from "../../services";
import { mapLocale, t, format } from "../../utils/localization";
import { colors } from "../../config";
import { CommandCategory } from "./help";

export const syncXpRoles = {
    data: new SlashCommandBuilder()
        .setName("syncxproles")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setNameLocalizations({
            "en-US": t("commands.syncxproles.name", "en-US"),
            "pt-BR": t("commands.syncxproles.name", "pt-BR"),
        })
        .setDescription(t("commands.syncxproles.description", "en-US"))
        .setDescriptionLocalizations({
            "en-US": t("commands.syncxproles.description", "en-US"),
            "pt-BR": t("commands.syncxproles.description", "pt-BR"),
        }),
    category: CommandCategory.XP,
    usage: "/syncxproles",
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        await interaction.deferReply();

        const pending = await Member.count({
            where: { guild_id: guild.id },
        });

        if (pending === 0) {
            return interaction.editReply({
                content: t("commands.syncxproles.response.empty", locale),
            });
        }

        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t("commands.syncxproles.response.title", locale))
            .setTimestamp(new Date())
            .setDescription(
                format(t("commands.syncxproles.response.started", locale), {
                    pending,
                }),
            );

        await interaction.editReply({ embeds: [embed.build()] });

        void (async () => {
            let synced: number;
            try {
                synced = await xpService.resyncGuildXpRoles(guild);
            } catch (e) {
                console.error("syncxproles resync:", e);
                try {
                    await interaction.followUp({
                        content: t(
                            "commands.syncxproles.errors.sync_failed",
                            locale,
                        ),
                        ephemeral: true,
                    });
                } catch (fe) {
                    console.error("syncxproles followUp (erro):", fe);
                }
                return;
            }
            try {
                await interaction.followUp({
                    content: format(
                        t("commands.syncxproles.response.followup", locale),
                        { synced },
                    ),
                    ephemeral: true,
                });
            } catch (fe) {
                console.error("syncxproles followUp (sucesso):", fe);
                try {
                    await interaction.followUp({
                        content: t(
                            "commands.syncxproles.errors.followup_expired",
                            locale,
                        ),
                        ephemeral: true,
                    });
                } catch {
                    /* interação expirou */
                }
            }
        })();
    },
};
