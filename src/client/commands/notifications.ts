import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { mapLocale, t } from "../../utils/localization";
import { subcommands as twitchSubcommands } from "./subcommands/twitch";
import { subcommands as youtubeSubcommands } from "./subcommands/youtube";
import { CommandCategory } from "./help";

const subcommands = [...twitchSubcommands, ...youtubeSubcommands];

const commandData = new SlashCommandBuilder()
    .setName("notifications")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setNameLocalizations({
        "en-US": t("commands.notifications.name", "en-US"),
        "pt-BR": t("commands.notifications.name", "pt-BR"),
    })
    .setDescription("Twitch live and YouTube upload notification settings")
    .setDescriptionLocalizations({
        "en-US": t("commands.notifications.description", "en-US"),
        "pt-BR": t("commands.notifications.description", "pt-BR"),
    });

const subcommandsMap = new Map<string, (typeof subcommands)[number]>();
subcommands.forEach((sub) => {
    subcommandsMap.set(sub.data.name, sub);
    commandData.addSubcommand(sub.data);
});

export const notifications = {
    data: commandData,
    category: CommandCategory.CONFIG,
    usage: "/notifications",
    execute: async (interaction: ChatInputCommandInteraction) => {
        const locale = mapLocale(interaction.locale);
        const subcommandName = interaction.options.getSubcommand();
        const subcommand = subcommandsMap.get(subcommandName);

        if (!subcommand) {
            return interaction.reply({
                content: t("client.error_on_command", locale),
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            await subcommand.execute(interaction);
        } catch (error) {
            console.error(
                `Error executing notifications subcommand ${subcommandName}:`,
                error
            );
            await interaction.reply({
                content: t("client.error_on_command", locale),
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
