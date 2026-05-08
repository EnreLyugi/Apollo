import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";
import WebSocket from "ws";

export const loop = {
    data: new SlashCommandSubcommandBuilder()
        .setName("loop")
        .setNameLocalizations({
            "en-US": t("commands.music.subcommands.loop.name", "en-US"),
            "pt-BR": t("commands.music.subcommands.loop.name", "pt-BR"),
        })
        .setDescription(t("commands.music.subcommands.loop.description", "en-US"))
        .setDescriptionLocalizations({
            "en-US": t("commands.music.subcommands.loop.description", "en-US"),
            "pt-BR": t("commands.music.subcommands.loop.description", "pt-BR"),
        })
        .addStringOption((opt) =>
            opt
                .setName("mode")
                .setNameLocalizations({
                    "en-US": t("commands.music.subcommands.loop.options.mode.name", "en-US"),
                    "pt-BR": t("commands.music.subcommands.loop.options.mode.name", "pt-BR"),
                })
                .setDescription(t("commands.music.subcommands.loop.options.mode.description", "en-US"))
                .setDescriptionLocalizations({
                    "en-US": t("commands.music.subcommands.loop.options.mode.description", "en-US"),
                    "pt-BR": t("commands.music.subcommands.loop.options.mode.description", "pt-BR"),
                })
                .setRequired(true)
                .addChoices(
                    {
                        name: t("commands.music.subcommands.loop.options.mode.choices.off", "en-US"),
                        name_localizations: {
                            "pt-BR": t("commands.music.subcommands.loop.options.mode.choices.off", "pt-BR"),
                        },
                        value: "off",
                    },
                    {
                        name: t("commands.music.subcommands.loop.options.mode.choices.track", "en-US"),
                        name_localizations: {
                            "pt-BR": t("commands.music.subcommands.loop.options.mode.choices.track", "pt-BR"),
                        },
                        value: "track",
                    },
                    {
                        name: t("commands.music.subcommands.loop.options.mode.choices.queue", "en-US"),
                        name_localizations: {
                            "pt-BR": t("commands.music.subcommands.loop.options.mode.choices.queue", "pt-BR"),
                        },
                        value: "queue",
                    }
                )
        ),
    usage: "/music loop",
    execute: async (interaction: ChatInputCommandInteraction, socket: WebSocket) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const mode = interaction.options.getString("mode", true) as "off" | "track" | "queue";

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const waitForWsResponse = (interactionId: string): Promise<any> => {
            return new Promise((resolve, reject) => {
                const onMessage = (data: WebSocket.RawData) => {
                    try {
                        const parsedData = JSON.parse(data.toString());
                        if (
                            parsedData.interactionId === interactionId &&
                            (parsedData.event === "loop_success" || parsedData.event === "loop_error")
                        ) {
                            socket.off("message", onMessage);
                            resolve(parsedData);
                        }
                    } catch (error) {
                        reject(error);
                    }
                };

                socket.on("message", onMessage);

                setTimeout(() => {
                    socket.off("message", onMessage);
                    reject(new Error("Timeout: No response from WebSocket"));
                }, 5000);
            });
        };

        socket.send(
            JSON.stringify({
                command: "loop",
                guildId: guild.id,
                interactionId: interaction.id,
                mode,
            })
        );

        try {
            const response = await waitForWsResponse(interaction.id);
            const embed = new Embed();

            if (response.event === "loop_error") {
                embed.setColor("#FF0000");
                if (response.error === "NO_QUEUE") {
                    embed.setDescription(t("player.errors.not_connected", locale));
                } else {
                    embed.setDescription(t("misc.error_ocurred", locale));
                }
            } else {
                embed.setColor(`#${colors.default_color}`);
                const key = `commands.music.subcommands.loop.response.${response.mode}` as const;
                embed.setDescription(t(key, locale));
            }

            await interaction.editReply({ embeds: [embed.build()] });
        } catch {
            const embed = new Embed()
                .setColor("#FF0000")
                .setDescription(t("misc.error_ocurred", locale));
            await interaction.editReply({ embeds: [embed.build()] });
        }
    },
};
