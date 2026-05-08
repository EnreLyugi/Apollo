"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xpAdmin = exports.xpUser = exports.xp = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models/");
const services_1 = require("../../services/");
const localization_1 = require("../../utils/localization");
const help_1 = require("./help");
exports.xp = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('xp')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.xp.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.xp.name', 'pt-BR')
    })
        .setDescription('Shows your current XP')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.xp.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.xp.description', 'pt-BR')
    }),
    category: help_1.CommandCategory.XP,
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        if (!guild)
            return;
        const userData = yield services_1.userService.createUserIfNotExists(interaction.user.id, interaction.user.username);
        const memberData = yield services_1.memberService.createMemberIfNotExists(interaction.user.id, guild.id);
        if (!userData || !memberData)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const description = (0, localization_1.format)((0, localization_1.t)('commands.xp.current_xp', locale), {
            //userXp: userData.xp,
            serverXp: memberData.xp,
        });
        const embed = new models_1.Embed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
            .setTimestamp(new Date());
        embed
            .setTitle('XP')
            .setDescription(description);
        embed.setTimestamp(new Date());
        yield interaction.reply({ embeds: [embed.build()], flags: discord_js_1.MessageFlags.Ephemeral });
    }),
};
exports.xpUser = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('xpuser')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.xpuser.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpuser.name', 'pt-BR')
    })
        .addSubcommand(new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('rank')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.xpuser.subcommands.rank.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpuser.subcommands.rank.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.xpuser.subcommands.rank.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.xpuser.subcommands.rank.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpuser.subcommands.rank.description', 'pt-BR')
    })),
    usage: '/xp',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild;
        if (!guild)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const embed = new models_1.Embed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
            .setTimestamp(new Date());
        if (subcommand === 'rank') {
            embed.setTitle((0, localization_1.t)('commands.xpuser.subcommands.rank.response.title', locale));
            const topMembers = yield services_1.xpService.getTop10(guild);
            if (!topMembers) {
                embed.setDescription((0, localization_1.t)('commands.xpuser.subcommands.rank.response.not_found', locale));
                yield interaction.reply({ embeds: [embed.build(),], flags: discord_js_1.MessageFlags.Ephemeral });
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
        yield interaction.reply({ embeds: [embed.build()], flags: discord_js_1.MessageFlags.Ephemeral });
    }),
};
exports.xpAdmin = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('xpadmin')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.name', 'pt-BR')
    })
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .addSubcommand(new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('add')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.add.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.add.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.xpadmin.subcommands.add.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.add.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.add.description', 'pt-BR')
    })
        .addUserOption(new discord_js_1.SlashCommandUserOption()
        .setName('user')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.add.options.user.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.add.options.user.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.xpadmin.subcommands.add.options.user.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.add.options.user.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.add.options.user.description', 'pt-BR')
    })
        .setRequired(true))
        .addIntegerOption(new discord_js_1.SlashCommandIntegerOption()
        .setName('amount')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.add.options.amount.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.add.options.amount.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.xpadmin.subcommands.add.options.amount.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.add.options.amount.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.add.options.amount.description', 'pt-BR')
    })
        .setRequired(true)))
        .addSubcommand(new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('remove')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.remove.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.remove.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.xpadmin.subcommands.remove.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.remove.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.remove.description', 'pt-BR')
    })
        .addUserOption(new discord_js_1.SlashCommandUserOption()
        .setName('user')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.remove.options.user.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.remove.options.user.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.xpadmin.subcommands.remove.options.user.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.remove.options.user.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.remove.options.user.description', 'pt-BR')
    })
        .setRequired(true))
        .addIntegerOption(new discord_js_1.SlashCommandIntegerOption()
        .setName('amount')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.remove.options.amount.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.remove.options.amount.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.xpadmin.subcommands.remove.options.amount.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.remove.options.amount.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.remove.options.amount.description', 'pt-BR')
    })
        .setRequired(true)))
        .addSubcommand(new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('reset')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.reset.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.reset.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.xpadmin.subcommands.reset.description', 'en-US'))
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.xpadmin.subcommands.reset.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.xpadmin.subcommands.reset.description', 'pt-BR')
    })),
    usage: '/xp',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild;
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        if (!guild)
            return;
        const embed = new models_1.Embed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
            .setTimestamp(new Date());
        console.log(`command received! ${subcommand}`);
        if (subcommand === 'add' || subcommand === 'remove') {
            if (!user || !amount)
                return;
            const member = guild.members.resolve(user.id);
            if (!member)
                return;
            if (subcommand === 'add') {
                embed.setTitle((0, localization_1.t)('commands.xpadmin.subcommands.add.response.title', locale));
                const memberData = yield services_1.xpService.addXP(interaction.guild, member, amount);
                if (memberData) {
                    embed.setDescription((0, localization_1.format)((0, localization_1.t)('commands.xpadmin.subcommands.add.response.added', locale), {
                        amount,
                        user: `${member}`
                    }));
                }
                else {
                    embed.setDescription((0, localization_1.t)('commands.xpadmin.subcommands.add.response.error', locale));
                }
            }
            else if (subcommand === 'remove') {
                embed.setTitle((0, localization_1.t)('commands.xpadmin.subcommands.remove.response.title', locale));
                const memberData = yield services_1.xpService.removeXP(interaction.guild, member, amount);
                if (memberData) {
                    embed.setDescription((0, localization_1.format)((0, localization_1.t)('commands.xpadmin.subcommands.remove.response.removed', locale), {
                        amount,
                        user: `${member}`
                    }));
                }
                else {
                    embed.setDescription((0, localization_1.t)('commands.xpadmin.subcommands.remove.response.error', locale));
                }
            }
        }
        if (subcommand === 'reset') {
            console.log("reset order received");
            embed.setTitle((0, localization_1.t)('commands.xpadmin.subcommands.reset.response.title', locale));
            console.log("asking for reset");
            const memberData = yield services_1.xpService.resetXP(interaction.guild);
            console.log(memberData);
            if (memberData) {
                embed.setDescription((0, localization_1.t)('commands.xpadmin.subcommands.reset.response.reseted', locale));
            }
            else {
                embed.setDescription((0, localization_1.t)('commands.xpadmin.subcommands.reset.response.error', locale));
            }
        }
        yield interaction.reply({ embeds: [embed.build(),], flags: discord_js_1.MessageFlags.Ephemeral });
        return;
    }),
};
