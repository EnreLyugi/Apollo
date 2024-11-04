import { ApplicationCommandSubCommand, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";

export const stop = {
    data: new SlashCommandSubcommandBuilder()
        .setName('stop')
        .setNameLocalizations({
            'en-US': t('commands.music.subcommands.stop.name', 'en-US'),
            'pt-BR': t('commands.music.subcommands.stop.name', 'pt-BR')
        })
        .setDescription(t('commands.music.subcommands.stop.description', 'en-US'))
        .setDescriptionLocalizations({
            'en-US': t('commands.music.subcommands.stop.description', 'en-US'),
            'pt-BR': t('commands.music.subcommands.stop.description', 'pt-BR')
        }),
    usage: '/music stop',
    execute: async (interaction: ChatInputCommandInteraction, subcommand: ApplicationCommandSubCommand) => {
        const guild = interaction.guild;
        if(!guild) return;

        const locale = mapLocale(interaction.locale);

        const embed = new Embed()
            .setAuthor({ name: t('commands.music.subcommands.stop.response.title', locale) })

        /*const guildQueue = player.getQueue(guild.id);
        if (!guildQueue) {
            embed.setColor('#FF0000')
            embed.setDescription(t('player.errors.not_connected', locale))

            interaction.reply({ embeds: [ embed.build() ], ephemeral: true })
            return;
        };

        if (!guildQueue.connection) return;
        guildQueue.stop();

        embed.setColor(`#${colors.default_color}`)
        embed.setDescription(t('commands.music.subcommands.stop.response.stopped', locale));

        interaction.reply({ embeds: [ embed.build() ], ephemeral: true });*/
    },
};