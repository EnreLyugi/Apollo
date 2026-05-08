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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.birthday = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../../../utils/localization");
const models_1 = require("../../../../models");
const config_1 = require("../../../../config");
const birthdayService_1 = __importDefault(require("../../../../services/birthdayService"));
exports.birthday = {
    data: new discord_js_1.SlashCommandSubcommandBuilder()
        .setName('birthday')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.set.subcommands.birthday.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.set.subcommands.birthday.name', 'pt-BR'),
    })
        .setDescription('Set a Birthday')
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.set.subcommands.birthday.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.set.subcommands.birthday.description', 'pt-BR'),
    })
        .addUserOption(new discord_js_1.SlashCommandUserOption()
        .setName('user')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.set.subcommands.birthday.choices.user.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.set.subcommands.birthday.choices.user.name', 'pt-BR'),
    })
        .setDescription('User to add')
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.set.subcommands.birthday.choices.user.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.set.subcommands.birthday.choices.user.description', 'pt-BR'),
    })
        .setRequired(true))
        .addStringOption(new discord_js_1.SlashCommandStringOption()
        .setName('date')
        .setNameLocalizations({
        'en-US': (0, localization_1.t)('commands.set.subcommands.birthday.choices.date.name', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.set.subcommands.birthday.choices.date.name', 'pt-BR'),
    })
        .setDescription('Birthday date (MM-DD)')
        .setDescriptionLocalizations({
        'en-US': (0, localization_1.t)('commands.set.subcommands.birthday.choices.date.description', 'en-US'),
        'pt-BR': (0, localization_1.t)('commands.set.subcommands.birthday.choices.date.description', 'pt-BR'),
    })
        .setRequired(true)),
    usage: '/set birthday <user> <date>',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = interaction.guild;
        const user = interaction.options.getUser('user');
        const date = interaction.options.getString('date');
        if (!guild || !user || !date)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        let day, month;
        if (/^\d{2}\/\d{2}$/.test(date)) {
            [day, month] = date.split('/').map(Number);
        }
        else if (/^\d{2}-\d{2}$/.test(date)) {
            [month, day] = date.split('-').map(Number);
        }
        else {
            return interaction.reply({
                content: (0, localization_1.t)("commands.set.subcommands.birthday.errors.invalid_format", locale),
                flags: discord_js_1.MessageFlags.Ephemeral
            });
        }
        if (isNaN(day) || isNaN(month) ||
            day < 1 || day > 31 ||
            month < 1 || month > 12) {
            return interaction.reply({
                content: (0, localization_1.t)("commands.set.subcommands.birthday.errors.invalid_date", locale),
                flags: discord_js_1.MessageFlags.Ephemeral
            });
        }
        const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
        yield birthdayService_1.default.addBirthday(user.id, formattedDate);
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setTitle((0, localization_1.t)('commands.set.subcommands.birthday.response.title', locale))
            .setTimestamp(new Date())
            .setDescription((0, localization_1.format)((0, localization_1.t)(`commands.set.subcommands.birthday.response.body`, locale), {
            "user": `${user}`,
            "date": date
        }));
        interaction.reply({ embeds: [embed.build()] });
    })
};
