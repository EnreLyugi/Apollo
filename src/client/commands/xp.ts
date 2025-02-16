import {
    ChatInputCommandInteraction,
    EmbedAssertions,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandSubcommandBuilder,
    SlashCommandUserOption
} from "discord.js";
import { Embed } from "../../models/"
import { memberService, userService, xpService } from '../../services/';
import { t, format, mapLocale } from '../../utils/localization';

export const xp = {
    data: new SlashCommandBuilder()
        .setName('xp'),        
    usage: '/xp',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if(!guild) return;
        const userData = await userService.createUserIfNotExists(interaction.user.id, interaction.user.username);
        const memberData = await memberService.createMemberIfNotExists(interaction.user.id, guild.id);

        if(!userData || !memberData) return;

        const locale = mapLocale(interaction.locale);
        const description = format(t('commands.xp.current_xp', locale), {
            //userXp: userData.xp,
            serverXp: memberData.xp,
        });

        const embed = new Embed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
            .setTimestamp(new Date())

        embed
            .setTitle('XP')
            .setDescription(description)

        embed.setTimestamp(new Date());

        await interaction.reply({ embeds: [ embed.build() ], ephemeral: true });
    },
};

export const xpUser = {
    data: new SlashCommandBuilder()
        .setName('xpuser')
        .setNameLocalizations({
            'en-US': t('commands.xpuser.name', 'en-US'),
            'pt-BR': t('commands.xpuser.name', 'pt-BR')
        })
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('rank')
            .setNameLocalizations({
                'en-US': t('commands.xpuser.subcommands.rank.name', 'en-US'),
                'pt-BR': t('commands.xpuser.subcommands.rank.name', 'pt-BR')
            })
            .setDescription(t('commands.xpuser.subcommands.rank.description', 'en-US'))
            .setDescriptionLocalizations({
                'en-US': t('commands.xpuser.subcommands.rank.description', 'en-US'),
                'pt-BR': t('commands.xpuser.subcommands.rank.description', 'pt-BR')
            })
        ),
    usage: '/xp',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild;
        if(!guild) return;

        const locale = mapLocale(interaction.locale);

        const embed = new Embed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
            .setTimestamp(new Date())

        if (subcommand === 'rank') {
            embed.setTitle(t('commands.xpuser.subcommands.rank.response.title', locale))

            const topMembers = await xpService.getTop10(guild);

            if(!topMembers) {
                embed.setDescription(t('commands.xpuser.subcommands.rank.response.not_found', locale));
                await interaction.reply({ embeds: [ embed.build(), ], ephemeral: true });
                return;
            }

            let description = '';
            let index = 1;
            topMembers.map(member => {
                console.log(member);
                description += `${index} - <@${member.member_id}> (${member.xp}xp)\n`;
                index++;
            });

            embed.setDescription(description);
        }

        embed.setTimestamp(new Date());

        await interaction.reply({ embeds: [ embed.build() ], ephemeral: true });
    },
}

export const xpAdmin = {
    data: new SlashCommandBuilder()
        .setName('xpadmin')
        .setNameLocalizations({
            'en-US': t('commands.xpadmin.name', 'en-US'),
            'pt-BR': t('commands.xpadmin.name', 'pt-BR')
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('add')
            .setNameLocalizations({
                'en-US': t('commands.xpadmin.subcommands.add.name', 'en-US'),
                'pt-BR': t('commands.xpadmin.subcommands.add.name', 'pt-BR')
            })
            .setDescription(t('commands.xpadmin.subcommands.add.description', 'en-US'))
            .setDescriptionLocalizations({
                'en-US': t('commands.xpadmin.subcommands.add.description', 'en-US'),
                'pt-BR': t('commands.xpadmin.subcommands.add.description', 'pt-BR')
            })
            .addUserOption(new SlashCommandUserOption()
                .setName('user')
                .setNameLocalizations({
                    'en-US': t('commands.xpadmin.subcommands.add.options.user.name', 'en-US'),
                    'pt-BR': t('commands.xpadmin.subcommands.add.options.user.name', 'pt-BR')
                })
                .setDescription(t('commands.xpadmin.subcommands.add.options.user.description', 'en-US'))
                .setDescriptionLocalizations({
                    'en-US': t('commands.xpadmin.subcommands.add.options.user.description', 'en-US'),
                    'pt-BR': t('commands.xpadmin.subcommands.add.options.user.description', 'pt-BR')
                })
                .setRequired(true)
            )
            .addIntegerOption(new SlashCommandIntegerOption()
                .setName('amount')
                .setNameLocalizations({
                    'en-US': t('commands.xpadmin.subcommands.add.options.amount.name', 'en-US'),
                    'pt-BR': t('commands.xpadmin.subcommands.add.options.amount.name', 'pt-BR')
                })
                .setDescription(t('commands.xpadmin.subcommands.add.options.amount.description', 'en-US'))
                .setDescriptionLocalizations({
                    'en-US': t('commands.xpadmin.subcommands.add.options.amount.description', 'en-US'),
                    'pt-BR': t('commands.xpadmin.subcommands.add.options.amount.description', 'pt-BR')
                })
                .setRequired(true)
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('remove')
            .setNameLocalizations({
                'en-US': t('commands.xpadmin.subcommands.remove.name', 'en-US'),
                'pt-BR': t('commands.xpadmin.subcommands.remove.name', 'pt-BR')
            })
            .setDescription(t('commands.xpadmin.subcommands.remove.description', 'en-US'))
            .setDescriptionLocalizations({
                'en-US': t('commands.xpadmin.subcommands.remove.description', 'en-US'),
                'pt-BR': t('commands.xpadmin.subcommands.remove.description', 'pt-BR')
            })
            .addUserOption(new SlashCommandUserOption()
                .setName('user')
                .setNameLocalizations({
                    'en-US': t('commands.xpadmin.subcommands.remove.options.user.name', 'en-US'),
                    'pt-BR': t('commands.xpadmin.subcommands.remove.options.user.name', 'pt-BR')
                })
                .setDescription(t('commands.xpadmin.subcommands.remove.options.user.description', 'en-US'))
                .setDescriptionLocalizations({
                    'en-US': t('commands.xpadmin.subcommands.remove.options.user.description', 'en-US'),
                    'pt-BR': t('commands.xpadmin.subcommands.remove.options.user.description', 'pt-BR')
                })
                .setRequired(true)
            )
            .addIntegerOption(new SlashCommandIntegerOption()
                .setName('amount')
                .setNameLocalizations({
                    'en-US': t('commands.xpadmin.subcommands.remove.options.amount.name', 'en-US'),
                    'pt-BR': t('commands.xpadmin.subcommands.remove.options.amount.name', 'pt-BR')
                })
                .setDescription(t('commands.xpadmin.subcommands.remove.options.amount.description', 'en-US'))
                .setDescriptionLocalizations({
                    'en-US': t('commands.xpadmin.subcommands.remove.options.amount.description', 'en-US'),
                    'pt-BR': t('commands.xpadmin.subcommands.remove.options.amount.description', 'pt-BR')
                })
                .setRequired(true)
            )
        ),
    usage: '/xp',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild;
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        const locale = mapLocale(interaction.locale);
            
        if(!user || !amount || !guild) return;

        const member = guild.members.resolve(user.id);
        if(!member) return;

        const embed = new Embed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
            .setTimestamp(new Date())

        if (subcommand === 'add') {
            embed.setTitle(t('commands.xpadmin.subcommands.add.response.title', locale))

            const memberData = await xpService.addXP(interaction.guild, member, amount);

            if(memberData) {
                embed.setDescription(format(t('commands.xpadmin.subcommands.add.response.added', locale), {
                    amount,
                    user: `${member}`
                }));
            } else {
                embed.setDescription(t('commands.xpadmin.subcommands.add.response.error', locale))
            }
        } else if(subcommand === 'remove') {
            embed.setTitle(t('commands.xpadmin.subcommands.remove.response.title', locale))

            const memberData = await xpService.removeXP(interaction.guild, member, amount);

            if(memberData) {
                embed.setDescription(format(t('commands.xpadmin.subcommands.remove.response.removed', locale), {
                    amount,
                    user: `${member}`
                }));
            } else {
                embed.setDescription(t('commands.xpadmin.subcommands.remove.response.error', locale))
            }
        }

        await interaction.reply({ embeds: [ embed.build(), ], ephemeral: true });
        return;
    },
}