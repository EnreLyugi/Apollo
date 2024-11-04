import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandRoleOption
} from "discord.js";
import { Embed } from "../../models/";
import { xpRoleService } from "../../services";
import { mapLocale, t, format } from "../../utils/localization";
import { colors } from "../../config";

export const addXpRole = {
    data: new SlashCommandBuilder()
        .setName('addxprole')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(new SlashCommandRoleOption()
            .setName('role')
            .setNameLocalizations({
                "en-US": t('commands.addxprole.options.role.name', 'en-US'),
                "pt-BR": t('commands.addxprole.options.role.name', 'pt-BR')
            })
            .setDescription(t('commands.addxprole.options.role.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.addxprole.options.role.description', 'en-US'),
                "pt-BR": t('commands.addxprole.options.role.description', 'pt-BR')
            })
            .setRequired(true)
        )
        .addIntegerOption(new SlashCommandIntegerOption()
            .setName('level')
            .setNameLocalizations({
                "en-US": t('commands.addxprole.options.level.name', 'en-US'),
                "pt-BR": t('commands.addxprole.options.level.name', 'pt-BR')
            })
            .setDescription(t('commands.addxprole.options.level.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.addxprole.options.level.description', 'en-US'),
                "pt-BR": t('commands.addxprole.options.level.description', 'pt-BR')
            })
            .setRequired(true)
        )
        .addIntegerOption(new SlashCommandIntegerOption()
            .setName('xp')
            .setNameLocalizations({
                "en-US": t('commands.addxprole.options.xp.name', 'en-US'),
                "pt-BR": t('commands.addxprole.options.xp.name', 'pt-BR')
            })
            .setDescription(t('commands.addxprole.options.xp.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.addxprole.options.xp.description', 'en-US'),
                "pt-BR": t('commands.addxprole.options.xp.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    usage: '/addxprole <role> <level> <xp>',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const role = interaction.options.getRole('role');
        const level = interaction.options.getInteger('level');
        const xp = interaction.options.getInteger('xp');
        if(!guild || !role || !level || !xp) return;

        const locale = mapLocale(interaction.locale);
        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t('commands.addxprole.response.title', locale))
            .setTimestamp(new Date());

        const isRoleAlreadySet = await xpRoleService.getRole(role.id, guild.id);
        if(isRoleAlreadySet !== null) {
            embed.setDescription(t('commands.addxprole.response.role_already_exists', locale));
            return interaction.reply({ embeds: [ embed.build() ] });
        }

        await xpRoleService.addRole(role.id, guild.id, level, xp);

        embed.setDescription(format(t('commands.addxprole.response.role_setup', locale), {
            "role": `${role}`,
            "level": level,
            "xp": xp
        }));
        return interaction.reply({ embeds: [ embed.build() ] });
    }
};