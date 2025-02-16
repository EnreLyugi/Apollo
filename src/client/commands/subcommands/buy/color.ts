import { 
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    SlashCommandIntegerOption
} from "discord.js";
import { Embed } from "../../../../models/";
import { colorRoleService, guildService, memberService } from "../../../../services";
import { mapLocale, t, format } from "../../../../utils/localization";
import { colors } from "../../../../config";
import e from "express";

export const color = {
    data: new SlashCommandSubcommandBuilder()
        .setName('buycolor')
        .setNameLocalizations({
            "en-US": t('commands.buy.subcommands.color.name', 'en-US'),
            "pt-BR": t('commands.buy.subcommands.color.name', 'pt-BR')
        })
        .setDescription('Buy a color')
        .setDescriptionLocalizations({
            'en-US': t('commands.buy.subcommands.color.description', 'en-US'),
            'pt-BR': t('commands.buy.subcommands.color.description', 'pt-BR'),
        })
        .addIntegerOption(new SlashCommandIntegerOption()
            .setName('colorid')
            .setNameLocalizations({
                "en-US": t('commands.buy.subcommands.color.options.colorid.name', 'en-US'),
                "pt-BR": t('commands.buy.subcommands.color.options.colorid.name', 'pt-BR')
            })
            .setDescription(t('commands.buy.subcommands.color.options.colorid.description', 'en-US'))
            .setDescriptionLocalizations({
                "en-US": t('commands.buy.subcommands.color.options.colorid.description', 'en-US'),
                "pt-BR": t('commands.buy.subcommands.color.options.colorid.description', 'pt-BR')
            })
            .setRequired(true)
        ),
    usage: '/buy color <color number>',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        const member = interaction.member;
        const colorid = interaction.options.getInteger('colorid');

        if(!guild || !colorid || !member) return;

        const locale = mapLocale(interaction.locale);
        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setTitle(t('commands.buy.subcommands.color.response.title', locale))
            .setTimestamp(new Date());

        const memberData = await memberService.getMember(member.user.id, guild.id);
        const guildData = await guildService.getGuildById(guild.id);

        if(!memberData || !guildData) return;

        if(memberData.coin < guildData.color_roles_price) {
            embed.setDescription(format(t('commands.buy.subcommands.color.response.insuficient', locale), {
                coins: memberData.coin,
                price: guildData.color_roles_price
            }));
        } else {
            const roles = await colorRoleService.getGuildRoles(guild.id);

            if(!roles || !roles[colorid-1]) return;

            const role = roles[colorid-1];

            const guildMember = guild.members.resolve(member.user.id);
            if(!guildMember) return;

            if(!guildMember.roles.resolve(role.role_id)) {
                memberData.coin -= guildData.color_roles_price;
                await memberData.save();

                roles.map(role => {
                    if(guildMember.roles.resolve(role.role_id)) {
                        guildMember.roles.remove(role.role_id).catch(e => { throw new Error('buying failed') })
                    }
                });

                await guildMember.roles.add(role.role_id).catch(e => { throw new Error('buying failed') });

                embed.setDescription(`Você comprou o cargo <@&${role.role_id}> (**${role.name}**)`);
            } else {
                embed.setDescription(`Você já possui o cargo <@&${role.role_id}> (**${role.name}**)`);
            }
        }


        return interaction.reply({ embeds: [ embed.build() ], ephemeral: true });
    }
};