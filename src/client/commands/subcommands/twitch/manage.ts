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
    name: t(`commands.twitch.subcommands.${value}.name`, "en-US"),
    name_localizations: {
        "en-US": t(`commands.twitch.subcommands.${value}.name`, "en-US"),
        "pt-BR": t(`commands.twitch.subcommands.${value}.name`, "pt-BR"),
    },
    value,
});

export const manage = {
    data: new SlashCommandSubcommandBuilder()
        .setName("twitch")
        .setNameLocalizations({
            "en-US": t("commands.notifications.subcommands.twitch.name", "en-US"),
            "pt-BR": t("commands.notifications.subcommands.twitch.name", "pt-BR"),
        })
        .setDescription("Twitch live notification settings")
        .setDescriptionLocalizations({
            "en-US": t("commands.notifications.subcommands.twitch.description", "en-US"),
            "pt-BR": t("commands.notifications.subcommands.twitch.description", "pt-BR"),
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
                .setName("username")
                .setNameLocalizations({
                    "en-US": t("commands.twitch.subcommands.add.options.username.name", "en-US"),
                    "pt-BR": t("commands.twitch.subcommands.add.options.username.name", "pt-BR"),
                })
                .setDescription("Twitch username (for add, remove, and set-description)")
                .setDescriptionLocalizations({
                    "en-US": t("commands.notifications.options.username.description", "en-US"),
                    "pt-BR": t("commands.notifications.options.username.description", "pt-BR"),
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
        const username = interaction.options.getString("username");

        if (action === "add" || action === "remove" || action === "set_description") {
            if (!username?.trim()) {
                return interaction.reply({
                    content: t(
                        "commands.notifications.errors.username_required",
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
