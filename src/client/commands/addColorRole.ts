import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandRoleOption,
    SlashCommandStringOption
} from "discord.js";
import { Embed } from "../../models/";
import { colorRoleService } from "../../services";
import { mapLocale, t, format } from "../../utils/localization";
import { colors } from "../../config";

export const addColorRole = {
    data: new SlashCommandBuilder()
        .setName('addcolorrole')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(new SlashCommandRoleOption()
            .setName('role')
            .setNameLocalizations({
                "en-US": t('commands.addcolorrole.options.role.name', 'en-US'),
                "pt-BR": t('commands.addcolorrole.options.role.name', 'pt-BR')
            })
            .setDescription(t('commands.addcolorrole.options.role.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.addcolorrole.options.role.description', 'en-US'),
                "pt-BR": t('commands.addcolorrole.options.role.description', 'pt-BR')
            })
            .setRequired(true)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName('name')
            .setNameLocalizations({
                "en-US": t('commands.addcolorrole.options.name.name', 'en-US'),
                "pt-BR": t('commands.addcolorrole.options.name.name', 'pt-BR')
            })
            .setDescription(t('commands.addcolorrole.options.name.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.addcolorrole.options.name.description', 'en-US'),
                "pt-BR": t('commands.addcolorrole.options.name.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    usage: '/addcolorrole <role>',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const role = interaction.options.getRole('role');
        const roleName = interaction.options.getString('name');
        if(!guild || !role || !roleName) return;

        const locale = mapLocale(interaction.locale);
        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t('commands.addcolorrole.response.title', locale))
            .setTimestamp(new Date());

        const isRoleAlreadySet = await colorRoleService.getRole(role.id);
        if(isRoleAlreadySet !== null) {
            embed.setDescription(t('commands.addcolorrole.response.role_already_exists', locale));
            return interaction.reply({ embeds: [ embed.build() ] });
        }

        await colorRoleService.addRole(role.id, guild.id, roleName);

        embed.setDescription(format(t('commands.addcolorrole.response.role_setup', locale), {
            "role": `${role}`,
            "name": `${roleName}`
        }));

        return interaction.reply({ embeds: [ embed.build() ] });
    }
};