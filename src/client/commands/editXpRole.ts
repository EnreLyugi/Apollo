import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandRoleOption,
} from "discord.js";
import { Embed } from "../../models/";
import { xpRoleService } from "../../services";
import { mapLocale, t, format } from "../../utils/localization";
import { colors } from "../../config";
import { CommandCategory } from "./help";

export const editXpRole = {
    data: new SlashCommandBuilder()
        .setName("editxprole")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setNameLocalizations({
            "en-US": t("commands.editxprole.name", "en-US"),
            "pt-BR": t("commands.editxprole.name", "pt-BR"),
        })
        .setDescription(t("commands.editxprole.description", "en-US"))
        .setDescriptionLocalizations({
            "en-US": t("commands.editxprole.description", "en-US"),
            "pt-BR": t("commands.editxprole.description", "pt-BR"),
        })
        .addRoleOption(
            new SlashCommandRoleOption()
                .setName("role")
                .setNameLocalizations({
                    "en-US": t("commands.addxprole.options.role.name", "en-US"),
                    "pt-BR": t("commands.addxprole.options.role.name", "pt-BR"),
                })
                .setDescription(t("commands.addxprole.options.role.description", "en-US"))
                .setDescriptionLocalizations({
                    "en-US": t("commands.addxprole.options.role.description", "en-US"),
                    "pt-BR": t("commands.addxprole.options.role.description", "pt-BR"),
                })
                .setRequired(true),
        )
        .addIntegerOption(
            new SlashCommandIntegerOption()
                .setName("xp")
                .setNameLocalizations({
                    "en-US": t("commands.addxprole.options.xp.name", "en-US"),
                    "pt-BR": t("commands.addxprole.options.xp.name", "pt-BR"),
                })
                .setDescription(t("commands.editxprole.options.xp.description", "en-US"))
                .setDescriptionLocalizations({
                    "en-US": t("commands.editxprole.options.xp.description", "en-US"),
                    "pt-BR": t("commands.editxprole.options.xp.description", "pt-BR"),
                })
                .setRequired(true)
                .setMinValue(0),
        )
        .addIntegerOption(
            new SlashCommandIntegerOption()
                .setName("level")
                .setNameLocalizations({
                    "en-US": t("commands.addxprole.options.level.name", "en-US"),
                    "pt-BR": t("commands.addxprole.options.level.name", "pt-BR"),
                })
                .setDescription(t("commands.editxprole.options.level.description", "en-US"))
                .setDescriptionLocalizations({
                    "en-US": t("commands.editxprole.options.level.description", "en-US"),
                    "pt-BR": t("commands.editxprole.options.level.description", "pt-BR"),
                })
                .setRequired(false),
        ),
    category: CommandCategory.XP,
    usage: "/editxprole <role> <xp> [level]",
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const role = interaction.options.getRole("role");
        const xp = interaction.options.getInteger("xp");
        const levelOpt = interaction.options.getInteger("level");
        if (!guild || !role || xp === null) return;

        const locale = mapLocale(interaction.locale);

        const existing = await xpRoleService.getRole(role.id, guild.id);
        if (!existing) {
            return interaction.reply({
                content: t("commands.editxprole.errors.not_configured", locale),
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            await xpRoleService.updateRoleXp(
                role.id,
                guild.id,
                xp,
                levelOpt ?? undefined,
            );
        } catch (e) {
            console.error("editxprole save:", e);
            return interaction.reply({
                content: t("commands.editxprole.errors.save_failed", locale),
                flags: MessageFlags.Ephemeral,
            });
        }

        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t("commands.editxprole.response.title", locale))
            .setTimestamp(new Date())
            .setDescription(
                format(t("commands.editxprole.response.body", locale), {
                    role: `${role}`,
                    level: levelOpt ?? existing.level,
                    xp,
                }) +
                    "\n\n" +
                    t("commands.editxprole.response.hint", locale),
            );

        return interaction.reply({ embeds: [embed.build()] });
    },
};
