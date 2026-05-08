import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandRoleOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { format, mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";
import { guildService } from "../../../../services";
import { normalizeInviteCode } from "../../../../utils/inviteCode";

export const inviteRole = {
    data: new SlashCommandSubcommandBuilder()
        .setName("invite-role")
        .setNameLocalizations({
            "en-US": t("commands.set.subcommands.invite_role.name", "en-US"),
            "pt-BR": t("commands.set.subcommands.invite_role.name", "pt-BR"),
        })
        .setDescription(t("commands.set.subcommands.invite_role.description", "en-US"))
        .setDescriptionLocalizations({
            "en-US": t("commands.set.subcommands.invite_role.description", "en-US"),
            "pt-BR": t("commands.set.subcommands.invite_role.description", "pt-BR"),
        })
        .addStringOption(
            new SlashCommandStringOption()
                .setName("invite_code")
                .setNameLocalizations({
                    "en-US": t(
                        "commands.set.subcommands.invite_role.options.invite_code.name",
                        "en-US",
                    ),
                    "pt-BR": t(
                        "commands.set.subcommands.invite_role.options.invite_code.name",
                        "pt-BR",
                    ),
                })
                .setDescription(
                    t(
                        "commands.set.subcommands.invite_role.options.invite_code.description",
                        "en-US",
                    ),
                )
                .setDescriptionLocalizations({
                    "en-US": t(
                        "commands.set.subcommands.invite_role.options.invite_code.description",
                        "en-US",
                    ),
                    "pt-BR": t(
                        "commands.set.subcommands.invite_role.options.invite_code.description",
                        "pt-BR",
                    ),
                })
                .setRequired(true),
        )
        .addRoleOption(
            new SlashCommandRoleOption()
                .setName("role")
                .setNameLocalizations({
                    "en-US": t(
                        "commands.set.subcommands.invite_role.options.role.name",
                        "en-US",
                    ),
                    "pt-BR": t(
                        "commands.set.subcommands.invite_role.options.role.name",
                        "pt-BR",
                    ),
                })
                .setDescription(
                    t("commands.set.subcommands.invite_role.options.role.description", "en-US"),
                )
                .setDescriptionLocalizations({
                    "en-US": t(
                        "commands.set.subcommands.invite_role.options.role.description",
                        "en-US",
                    ),
                    "pt-BR": t(
                        "commands.set.subcommands.invite_role.options.role.description",
                        "pt-BR",
                    ),
                })
                .setRequired(false),
        ),
    usage: "/set invite-role",
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const rawCode = interaction.options.getString("invite_code", true);
        const role = interaction.options.getRole("role");

        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const code = normalizeInviteCode(rawCode);
        if (!code) {
            return interaction.reply({
                content: t("commands.set.subcommands.invite_role.errors.invalid_code", locale),
                flags: MessageFlags.Ephemeral,
            });
        }

        await guildService.setInviteRole(guild.id, rawCode, role?.id ?? null);

        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t("commands.set.subcommands.channel.response_title", locale))
            .setTimestamp(new Date());

        if (role) {
            embed.setDescription(
                format(t("commands.set.subcommands.invite_role.response.set", locale), {
                    code,
                    role: role.name,
                }),
            );
        } else {
            embed.setDescription(
                format(t("commands.set.subcommands.invite_role.response.removed", locale), {
                    code,
                }),
            );
        }

        return interaction.reply({ embeds: [embed.build()] });
    },
};
