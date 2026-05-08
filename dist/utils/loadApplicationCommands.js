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
exports.loadApplicationCommands = void 0;
const discord_js_1 = require("discord.js");
const commands_1 = require("../client/commands/");
const localization_1 = require("./localization");
const loadApplicationCommands = () => __awaiter(void 0, void 0, void 0, function* () {
    const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN || '');
    console.log('Started refreshing application (/) commands.');
    const commandList = [];
    commands_1.commands.forEach(command => {
        var _a;
        const { data } = command;
        const commandNames = (0, localization_1.getCommandNames)(data.name || '');
        const commandDescriptions = (0, localization_1.getCommandDescriptions)(data.name || '');
        data.setDescription((_a = commandDescriptions["en-US"]) !== null && _a !== void 0 ? _a : '')
            .setNameLocalizations(commandNames)
            .setDescriptionLocalizations(commandDescriptions);
        commandList.push(command.data);
    });
    yield rest.put(discord_js_1.Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || ''), { body: commandList })
        .then(() => {
        console.log('Successfully reloaded application (/) commands.');
    })
        .catch((err) => {
        throw new Error(err);
    });
});
exports.loadApplicationCommands = loadApplicationCommands;
