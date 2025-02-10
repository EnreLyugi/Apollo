import {
    ChatInputCommandInteraction,
    SlashCommandRoleOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder
} from "discord.js";
import { format, mapLocale, t } from "../../../../utils/localization";
import { Embed } from "../../../../models";
import { colors } from "../../../../config";
import { guildService } from "../../../../services";

export const role = {
    data: new SlashCommandSubcommandBuilder()
    .setName('role')
    .setNameLocalizations({
        "en-US": t('commands.set.subcommands.role.name', 'en-US'),
        "pt-BR": t('commands.set.subcommands.role.name', 'pt-BR')
    })
    .setDescription('Set a role')
    .setDescriptionLocalizations({
        'en-US': t('commands.set.subcommands.role.description', 'en-US'),
        'pt-BR': t('commands.set.subcommands.role.description', 'pt-BR'),
    })
    .addStringOption(new SlashCommandStringOption()
        .setName('roletype')
        .setNameLocalizations({
            "en-US": t('commands.set.subcommands.role.options.roletype.name', 'en-US'),
            "pt-BR": t('commands.set.subcommands.role.options.roletype.name', 'pt-BR')
        })
        .setDescription(t('commands.set.options.roletype.description', 'en-US'))
        .setDescriptionLocalizations({
            "en-US": t('commands.set.subcommands.role.options.roletype.description', 'en-US'),
            "pt-BR": t('commands.set.subcommands.role.options.roletype.description', 'pt-BR')
        })
        .setChoices([
            {
                "name": "welcome_role",
                "name_localizations": {
                    "en-US": t('commands.set.subcommands.role.options.roletype.choices.welcome_role.name', 'en-US'),
                    "pt-BR": t('commands.set.subcommands.role.options.roletype.choices.welcome_role.name', 'pt-BR')
                },
                "value": "welcome_role"
            }
        ])
        .setRequired(true)
    )
    .addRoleOption(new SlashCommandRoleOption()
        .setName('role')
        .setNameLocalizations({
            "en-US": t('commands.set.subcommands.role.options.role.name', 'en-US'),
            "pt-BR": t('commands.set.subcommands.role.options.role.name', 'pt-BR')
        })
        .setDescription('Role that will be given')
        .setDescriptionLocalizations({
            "en-US": t('commands.set.subcommands.role.options.role.description', 'en-US'),
            "pt-BR": t('commands.set.subcommands.role.options.role.description', 'pt-BR')
        })
        .setRequired(true)
    ),
    usage: '/set role',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const roleType = interaction.options.getString('roletype');
        const role = interaction.options.getRole('role');

        if(!guild || !role || !roleType) return;

        const locale = mapLocale(interaction.locale);

        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t('commands.setchannel.response_title', locale))
            .setTimestamp(new Date())
            .setDescription(format(t(`commands.set.subcommands.role.response_body`, locale), {
                "roleType": t(`commands.set.subcommands.role.options.roletype.choices.${roleType}.name`, locale)
            }));

        await guildService.setRole(roleType, guild.id, role.id);

        return interaction.reply({ embeds: [ embed.build() ] });
    },
};