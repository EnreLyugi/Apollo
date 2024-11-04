import { ApplicationCommandSubCommand, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";

export const skip = {
    data: new SlashCommandSubcommandBuilder()
        .setName('skip')
        .setNameLocalizations({
            'en-US': t('commands.music.subcommands.skip.name', 'en-US'),
            'pt-BR': t('commands.music.subcommands.skip.name', 'pt-BR')
        })
        .setDescription(t('commands.music.subcommands.skip.description', 'en-US'))
        .setDescriptionLocalizations({
            'en-US': t('commands.music.subcommands.skip.description', 'en-US'),
            'pt-BR': t('commands.music.subcommands.skip.description', 'pt-BR')
        }),
    usage: '/music skip',
    execute: async (interaction: ChatInputCommandInteraction, subcommand: ApplicationCommandSubCommand) => {
        const guild = interaction.guild;
        if(!guild) return;

        const locale = mapLocale(interaction.locale);

        const embed = new Embed()
            .setAuthor({ name: t('commands.music.subcommands.skip.response.title', locale) })

        /*const guildQueue = player.getQueue(guild.id);
        if (!guildQueue) {
            embed.setColor('#FF0000')
            embed.setDescription(t('player.errors.not_connected', locale))

            interaction.reply({ embeds: [ embed.build() ], ephemeral: true })
            return;
        };

        if (!guildQueue.connection) return;
        guildQueue.skip();

        embed.setColor(`#${colors.default_color}`)
        embed.setDescription(t('commands.music.subcommands.skip.response.stopped', locale));

        interaction.reply({ embeds: [ embed.build() ], ephemeral: true });*/
    },
};