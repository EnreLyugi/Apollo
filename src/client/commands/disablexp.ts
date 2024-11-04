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

export const disablexp = {
    data: new SlashCommandBuilder()
        .setName('disablexp')
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