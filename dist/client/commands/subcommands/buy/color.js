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
exports.color = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../../../models/");
const services_1 = require("../../../../services");
const localization_1 = require("../../../../utils/localization");
const config_1 = require("../../../../config");
exports.color = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('buycolor')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.buy.subcommands.color.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.buy.subcommands.color.name', 'pt-BR')
    })
        .setDescription('Buy a color')
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.buy.subcommands.color.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.buy.subcommands.color.description', 'pt-BR'),
    })
        .addIntegerOption(new discord_js_1.SlashCommandIntegerOption()
        .setName('colorid')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.buy.subcommands.color.options.colorid.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.buy.subcommands.color.options.colorid.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.buy.subcommands.color.options.colorid.description', 'en-US'))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.buy.subcommands.color.options.colorid.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.buy.subcommands.color.options.colorid.description', 'pt-BR')
    })
        .setRequired(true)),
    usage: '/buy color <color number>',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const member = interaction.member;
        const colorid = interaction.options.getInteger('colorid');
        if (!guild || !colorid || !member)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)('commands.buy.subcommands.color.response.title', locale))
            .setTimestamp(new Date());
        const memberData = yield services_1.memberService.getMember(member.user.id, guild.id);
        const guildData = yield services_1.guildService.getGuildById(guild.id);
        if (!memberData || !guildData)
            return;
        if (memberData.coin < guildData.color_roles_price) {
            embed.setDescription((0, localization_1.format)((0, localization_1.t)('commands.buy.subcommands.color.response.insuficient', locale), {
                coins: memberData.coin,
                price: guildData.color_roles_price
            }));
        }
        else {
            const roles = yield services_1.colorRoleService.getGuildRoles(guild.id);
            if (!roles || !roles[colorid - 1])
                return;
            const role = roles[colorid - 1];
            const guildMember = guild.members.resolve(member.user.id);
            if (!guildMember)
                return;
            if (!guildMember.roles.resolve(role.role_id)) {
                memberData.coin -= guildData.color_roles_price;
                yield memberData.save();
                roles.map(role => {
                    if (guildMember.roles.resolve(role.role_id)) {
                        guildMember.roles.remove(role.role_id).catch(e => { throw new Error('buying failed'); });
                    }
                });
                yield guildMember.roles.add(role.role_id).catch(e => { throw new Error('buying failed'); });
                embed.setDescription(`Você comprou o cargo <@&${role.role_id}> (**${role.name}**)`);
            }
            else {
                embed.setDescription(`Você já possui o cargo <@&${role.role_id}> (**${role.name}**)`);
            }
        }
        return interaction.reply({ embeds: [embed.build()], flags: discord_js_1.MessageFlags.Ephemeral });
    })
};
