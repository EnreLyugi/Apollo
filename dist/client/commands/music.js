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
exports.music = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../utils/localization");
const music_1 = require("./subcommands/music");
const controllers_1 = require("../../controllers");
const help_1 = require("./help");
const commandData = new discord_js_1.SlashCommandBuilder()
    .setName('music')
    .setNameLocalizations({
    "en-US": (0, localization_1.t)('commands.music.name', 'en-US'),
    "pt-BR": (0, localization_1.t)('commands.music.name', 'pt-BR')
})
    .setDescription('Music Player')
    .setDescriptionLocalizations({
    "en-US": (0, localization_1.t)('commands.music.description', 'en-US'),
    "pt-BR": (0, localization_1.t)('commands.music.description', 'pt-BR')
});
const subcommandsMap = new Map();
music_1.subcommands.forEach(subcommand => {
    subcommandsMap.set(subcommand.data.name, subcommand);
    commandData.addSubcommand(subcommand.data);
});
exports.music = {
    data: commandData,
    category: help_1.CommandCategory.MUSIC,
    usage: '/music',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const subcommandName = interaction.options.getSubcommand();
        const subcommand = subcommandsMap.get(subcommandName);
        const guild = interaction.guild;
        if (!guild)
            return;
        const member = guild.members.resolve(interaction.user);
        if (!member)
            return;
        const channel = member.voice.channel;
        if (!channel)
            return;
        const socket = yield controllers_1.musicClusterController.instantiateCluster(channel);
        if (!socket)
            return;
        try {
            yield subcommand.execute(interaction, socket);
        }
        catch (error) {
            console.error(`Error executing command ${subcommandName}:`, error);
            yield interaction.reply({ content: (0, localization_1.t)(`client.error_on_command`, locale), ephemeral: true });
        }
    }),
};
