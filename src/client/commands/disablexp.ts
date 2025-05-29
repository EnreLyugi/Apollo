import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandChannelOption
} from "discord.js";
import { Embed } from "../../models/";
import { xpChannelService } from "../../services";
import { mapLocale, t, format } from "../../utils/localization";
import { colors } from "../../config";
import { CommandCategory } from "./help";

export const disablexp = {
    data: new SlashCommandBuilder()
        .setName('disablexp')
        .setNameLocalizations({
            "en-US": t('commands.disablexp.name', 'en-US'),
            "pt-BR": t('commands.disablexp.name', 'pt-BR')
        })
        .setDescription('Disable XP gain in a channel')
        .setDescriptionLocalizations({
            "en-US": t('commands.disablexp.description', 'en-US'),
            "pt-BR": t('commands.disablexp.description', 'pt-BR')
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(new SlashCommandChannelOption()
            .setName('channel')
            .setNameLocalizations({
                "en-US": t('commands.disablexp.options.channel.name', 'en-US'),
                "pt-BR": t('commands.disablexp.options.channel.name', 'pt-BR')
            })
            .setDescription(t('commands.disablexp.options.channel.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.disablexp.options.channel.description', 'en-US'),
                "pt-BR": t('commands.disablexp.options.channel.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    category: CommandCategory.XP,
    usage: '/disablexp <channel>',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const channel = interaction.options.getChannel('channel');
        if(!guild || !channel) return;

        const locale = mapLocale(interaction.locale);
        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t('commands.disablexp.response_title', locale))
            .setTimestamp(new Date());

        const isChannelDisabled = await xpChannelService.getChannel(channel.id, guild.id);
        if(isChannelDisabled !== null) {
            embed.setDescription(t('commands.disablexp.channel_already_disabled', locale));
            return interaction.reply({ embeds: [ embed.build() ] });
        }

        await xpChannelService.addChannel(channel.id, guild.id);

        embed.setDescription(format(t('commands.disablexp.xp_disabled', locale), {
            "channel_id": channel.id
        }));
        return interaction.reply({ embeds: [ embed.build() ] });
    }
};