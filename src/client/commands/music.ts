import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { mapLocale, t } from "../../utils/localization";
import { subcommands } from './subcommands/music';
import { musicClusterController } from "../../controllers";

const commandData =
    new SlashCommandBuilder()
        .setName('music')
        .setNameLocalizations({
            "en-US": t('commands.setchannel.options.channeltype.name', 'en-US'),
            "pt-BR": t('commands.setchannel.options.channeltype.name', 'pt-BR')
        });

const subcommandsMap = new Map();
subcommands.forEach(subcommand => {
    subcommandsMap.set(subcommand.data.name, subcommand);
    commandData.addSubcommand(subcommand.data);
});

export const music = {
    data: commandData,
    usage: '/music',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const locale = mapLocale(interaction.locale);
        const subcommandName = interaction.options.getSubcommand();
        const subcommand = subcommandsMap.get(subcommandName);

        const guild = interaction.guild;
        if(!guild) return

        const member = guild.members.resolve(interaction.user);
        if(!member) return

        const channel = member.voice.channel;
        if(!channel) return;

        const socket = await musicClusterController.instantiateCluster(channel);

        if(!socket) return

        try {
            await subcommand.execute(interaction, socket);
        } catch (error) {
            console.error(`Error executing command ${subcommandName}:`, error);
            await interaction.reply({ content: t(`client.error_on_command`, locale), ephemeral: true });
        }
    },
};