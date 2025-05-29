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

export const enablexp = {
    data: new SlashCommandBuilder()
        .setName('enablexp')
        .setNameLocalizations({
            "en-US": t('commands.enablexp.name', 'en-US'),
            "pt-BR": t('commands.enablexp.name', 'pt-BR')
        })
        .setDescription('Enable XP gain in a channel')
        .setDescriptionLocalizations({
            "en-US": t('commands.enablexp.description', 'en-US'),
            "pt-BR": t('commands.enablexp.description', 'pt-BR')
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(new SlashCommandChannelOption()
            .setName('channel')
            .setNameLocalizations({
                "en-US": t('commands.enablexp.options.channel.name', 'en-US'),
                "pt-BR": t('commands.enablexp.options.channel.name', 'pt-BR')
            })
            .setDescription(t('commands.enablexp.options.channel.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.enablexp.options.channel.description', 'en-US'),
                "pt-BR": t('commands.enablexp.options.channel.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    category: CommandCategory.XP,
    usage: '/enablexp <channel>',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const channel = interaction.options.getChannel('channel');
        if(!guild || !channel) return;

        const locale = mapLocale(interaction.locale);
        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t('commands.enablexp.response_title', locale))
            .setTimestamp(new Date());

        const isChannelDisabled = await xpChannelService.getChannel(channel.id, guild.id);
        if(isChannelDisabled == null) {
            embed.setDescription(t('commands.enablexp.channel_already_enabled', locale));
            return interaction.reply({ embeds: [ embed.build() ] });
        }

        await xpChannelService.removeChannel(channel.id, guild.id);

        embed.setDescription(format(t('commands.enablexp.xp_enabled', locale), {
            "channel_id": channel.id
        }));
        return interaction.reply({ embeds: [ embed.build() ] });
    }
};