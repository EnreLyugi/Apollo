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
exports.set = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../utils/localization");
const set_1 = require("./subcommands/set");
const help_1 = require("./help");
const commandData = new discord_js_1.SlashCommandBuilder()
    .setName('set')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .setNameLocalizations({
    "en-US": (0, localization_1.t)('commands.set.name', 'en-US'),
    "pt-BR": (0, localization_1.t)('commands.set.name', 'pt-BR')
})
    .setDescription('Sets some settings')
    .setDescriptionLocalizations({
    "en-US": (0, localization_1.t)('commands.set.description', 'en-US'),
    "pt-BR": (0, localization_1.t)('commands.set.description', 'pt-BR')
});
const subcommandsMap = new Map();
set_1.subcommands.forEach(subcommand => {
    subcommandsMap.set(subcommand.data.name, subcommand);
    commandData.addSubcommand(subcommand.data);
});
exports.set = {
    data: commandData,
    category: help_1.CommandCategory.CONFIG,
    usage: '/set',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const subcommandName = interaction.options.getSubcommand();
        const subcommand = subcommandsMap.get(subcommandName);
        try {
            yield subcommand.execute(interaction, subcommand);
        }
        catch (error) {
            console.error(`Error executing command ${subcommandName}:`, error);
            yield interaction.reply({ content: (0, localization_1.t)(`client.error_on_command`, locale), ephemeral: true });
        }
    }),
};
