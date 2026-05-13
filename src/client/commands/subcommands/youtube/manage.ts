import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { add } from "./add";
import { remove } from "./remove";
import { list } from "./list";
import { setDescription } from "./setDescription";

const actionChoice = (value: "add" | "remove" | "list" | "set_description") => ({
    name: t(`commands.youtube.subcommands.${value}.name`, "en-US"),
    name_localizations: {
        "en-US": t(`commands.youtube.subcommands.${value}.name`, "en-US"),
        "pt-BR": t(`commands.youtube.subcommands.${value}.name`, "pt-BR"),
    },
    value,
});

export const manage = {
    data: new SlashCommandSubcommandBuilder()
        .setName("youtube")
        .setNameLocalizations({
            "en-US": t("commands.notifications.subcommands.youtube.name", "en-US"),
            "pt-BR": t("commands.notifications.subcommands.youtube.name", "pt-BR"),
        })
        .setDescription("YouTube upload notification settings")
        .setDescriptionLocalizations({
            "en-US": t("commands.notifications.subcommands.youtube.description", "en-US"),
            "pt-BR": t("commands.notifications.subcommands.youtube.description", "pt-BR"),
        })
        .addStringOption(
            new SlashCommandStringOption()
                .setName("action")
                .setNameLocalizations({
                    "en-US": t("commands.notifications.options.action.name", "en-US"),
                    "pt-BR": t("commands.notifications.options.action.name", "pt-BR"),
                })
                .setDescription("What to do")
                .setDescriptionLocalizations({
                    "en-US": t("commands.notifications.options.action.description", "en-US"),
                    "pt-BR": t("commands.notifications.options.action.description", "pt-BR"),
                })
                .setRequired(true)
                .addChoices(
                    actionChoice("add"),
                    actionChoice("remove"),
                    actionChoice("list"),
                    actionChoice("set_description")
                )
        )
        .addStringOption(
            new SlashCommandStringOption()
                .setName("channel")
                .setNameLocalizations({
                    "en-US": t("commands.youtube.subcommands.add.options.channel.name", "en-US"),
                    "pt-BR": t("commands.youtube.subcommands.add.options.channel.name", "pt-BR"),
                })
                .setDescription("YouTube channel (for add, remove, and set-description)")
                .setDescriptionLocalizations({
                    "en-US": t("commands.notifications.options.channel.description", "en-US"),
                    "pt-BR": t("commands.notifications.options.channel.description", "pt-BR"),
                })
                .setRequired(false)
        )
        .addStringOption(
            new SlashCommandStringOption()
                .setName("custom_text")
                .setNameLocalizations({
                    "en-US": t("commands.notifications.options.custom_text.name", "en-US"),
                    "pt-BR": t("commands.notifications.options.custom_text.name", "pt-BR"),
                })
                .setDescription("Optional embed text; omit with set-description to clear")
                .setDescriptionLocalizations({
                    "en-US": t("commands.notifications.options.custom_text.description", "en-US"),
                    "pt-BR": t("commands.notifications.options.custom_text.description", "pt-BR"),
                })
                .setRequired(false)
                .setMaxLength(4096)
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const action = interaction.options.getString("action", true) as
            | "add"
            | "remove"
            | "list"
            | "set_description";
        const channel = interaction.options.getString("channel");

        if (action === "add" || action === "remove" || action === "set_description") {
            if (!channel?.trim()) {
                return interaction.reply({
                    content: t(
                        "commands.notifications.errors.channel_required",
                        mapLocale(interaction.locale)
                    ),
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

        if (action === "add") return add.execute(interaction);
        if (action === "remove") return remove.execute(interaction);
        if (action === "set_description") return setDescription.execute(interaction);
        return list.execute(interaction);
    },
};
