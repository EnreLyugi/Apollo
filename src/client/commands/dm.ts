import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';
import { mapLocale, t } from '../../utils/localization';
import { CommandCategory } from './help';

export const dm = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setNameLocalizations({
            'en-US': t('commands.dm.name', 'en-US'),
            'pt-BR': t('commands.dm.name', 'pt-BR'),
        })
        .setDescription(t('commands.dm.description', 'en-US'))
        .setDescriptionLocalizations({
            'en-US': t('commands.dm.description', 'en-US'),
            'pt-BR': t('commands.dm.description', 'pt-BR'),
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addUserOption((option) =>
            option
                .setName('user')
                .setNameLocalizations({
                    'en-US': t('commands.dm.options.user.name', 'en-US'),
                    'pt-BR': t('commands.dm.options.user.name', 'pt-BR'),
                })
                .setDescription(t('commands.dm.options.user.description', 'en-US'))
                .setDescriptionLocalizations({
                    'en-US': t('commands.dm.options.user.description', 'en-US'),
                    'pt-BR': t('commands.dm.options.user.description', 'pt-BR'),
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('message')
                .setNameLocalizations({
                    'en-US': t('commands.dm.options.message.name', 'en-US'),
                    'pt-BR': t('commands.dm.options.message.name', 'pt-BR'),
                })
                .setDescription(t('commands.dm.options.message.description', 'en-US'))
                .setDescriptionLocalizations({
                    'en-US': t('commands.dm.options.message.description', 'en-US'),
                    'pt-BR': t('commands.dm.options.message.description', 'pt-BR'),
                })
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(2000)
        ),
    category: CommandCategory.UTILITY,
    usage: '/dm user: @membro mensagem: texto',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const locale = mapLocale(interaction.locale);
        const target = interaction.options.getUser('user', true);
        const text = interaction.options.getString('message', true);

        if (target.bot) {
            return interaction.reply({
                content: t('commands.dm.response.error_bot', locale),
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            await target.send({ content: text });
            await interaction.editReply({ content: t('commands.dm.response.sent', locale) });
        } catch {
            await interaction.editReply({ content: t('commands.dm.response.error_cannot_dm', locale) });
        }
    },
};
