import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandRoleOption
} from "discord.js";
import { Embed } from "../../models/";
import { colorRoleService } from "../../services";
import { mapLocale, t, format } from "../../utils/localization";
import { colors } from "../../config";
import { CommandCategory } from "./help";

export const removeColorRole = {
    data: new SlashCommandBuilder()
        .setName('removecolorrole')
        .setNameLocalizations({
            "en-US": t('commands.removecolorrole.name', 'en-US'),
            "pt-BR": t('commands.removecolorrole.name', 'pt-BR')
        })
        .setDescription('Remove color roles from the shop')
        .setDescriptionLocalizations({
            "en-US": t('commands.removecolorrole.description', 'en-US'),
            "pt-BR": t('commands.removecolorrole.description', 'pt-BR')
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(new SlashCommandRoleOption()
            .setName('role')
            .setNameLocalizations({
                "en-US": t('commands.removecolorrole.options.role.name', 'en-US'),
                "pt-BR": t('commands.removecolorrole.options.role.name', 'pt-BR')
            })
            .setDescription(t('commands.addcolorrole.options.role.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.removecolorrole.options.role.description', 'en-US'),
                "pt-BR": t('commands.removecolorrole.options.role.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    category: CommandCategory.CONFIG,
    usage: '/removecolorrole <role>',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const role = interaction.options.getRole('role');
        if(!guild || !role) return;

        const locale = mapLocale(interaction.locale);
        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t('commands.removecolorrole.response.title', locale))
            .setTimestamp(new Date());

        const isRoleAlreadySet = await colorRoleService.getRole(role.id);
        if(isRoleAlreadySet == null) {
            embed.setDescription(t('commands.removecolorrole.response.role_dont_exists', locale));
            return interaction.reply({ embeds: [ embed.build() ] });
        }

        await colorRoleService.removeRole(role.id);

        embed.setDescription(format(t('commands.removecolorrole.response.role_removed', locale), {
            "role": `<@&${role.id}>`,
            "name": `${isRoleAlreadySet.name}`
        }));

        return interaction.reply({ embeds: [ embed.build() ] });
    }
};