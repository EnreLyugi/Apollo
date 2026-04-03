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
exports.role = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../../../utils/localization");
const models_1 = require("../../../../models");
const config_1 = require("../../../../config");
const services_1 = require("../../../../services");
exports.role = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('role')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.role.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.role.name', 'pt-BR')
    })
        .setDescription('Set a role')
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.set.subcommands.role.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.set.subcommands.role.description', 'pt-BR'),
    })
        .addStringOption(new discord_js_1.SlashCommandStringOption()
        .setName('roletype')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.role.options.roletype.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.role.options.roletype.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.set.options.roletype.description', 'en-US'))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.role.options.roletype.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.role.options.roletype.description', 'pt-BR')
    })
        .setChoices([
        {
            "name": "welcome_role",
            "name_localizations": {
                "en-US": (0, localization_1.t)('commands.set.subcommands.role.options.roletype.choices.welcome_role.name', 'en-US'),
                "pt-BR": (0, localization_1.t)('commands.set.subcommands.role.options.roletype.choices.welcome_role.name', 'pt-BR')
            },
            "value": "welcome_role"
        },
        {
            "name": "birthday_role",
            "name_localizations": {
                "en-US": (0, localization_1.t)('commands.set.subcommands.role.options.roletype.choices.birthday_role.name', 'en-US'),
                "pt-BR": (0, localization_1.t)('commands.set.subcommands.role.options.roletype.choices.birthday_role.name', 'pt-BR')
            },
            "value": "birthday_role"
        }
    ])
        .setRequired(true))
        .addRoleOption(new discord_js_1.SlashCommandRoleOption()
        .setName('role')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.role.options.role.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.role.options.role.name', 'pt-BR')
    })
        .setDescription('Role that will be given')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.set.subcommands.role.options.role.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.set.subcommands.role.options.role.description', 'pt-BR')
    })
        .setRequired(true)),
    usage: '/set role',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const roleType = interaction.options.getString('roletype');
        const role = interaction.options.getRole('role');
        if (!guild || !role || !roleType)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)('commands.setchannel.response_title', locale))
            .setTimestamp(new Date())
            .setDescription((0, localization_1.format)((0, localization_1.t)(`commands.set.subcommands.role.response_body`, locale), {
            "roleType": (0, localization_1.t)(`commands.set.subcommands.role.options.roletype.choices.${roleType}.name`, locale)
        }));
        yield services_1.guildService.setRole(roleType, guild.id, role.id);
        return interaction.reply({ embeds: [embed.build()] });
    }),
};
