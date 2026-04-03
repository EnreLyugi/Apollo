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
exports.buy = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../utils/localization");
const buy_1 = require("./subcommands/buy");
const help_1 = require("./help");
const commandData = new discord_js_1.SlashCommandBuilder()
    .setName('buy')
    .setNameLocalizations({
    "en-US": (0, localization_1.t)('commands.buy.name', 'en-US'),
    "pt-BR": (0, localization_1.t)('commands.buy.name', 'pt-BR')
})
    .setDescription('Buy items')
    .setDescriptionLocalizations({
    "en-US": (0, localization_1.t)('commands.buy.description', 'en-US'),
    "pt-BR": (0, localization_1.t)('commands.buy.description', 'pt-BR')
});
const subcommandsMap = new Map();
buy_1.subcommands.forEach(subcommand => {
    subcommandsMap.set(subcommand.data.name, subcommand);
    commandData.addSubcommand(subcommand.data);
});
exports.buy = {
    data: commandData,
    category: help_1.CommandCategory.ECONOMY,
    usage: '/buy',
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
