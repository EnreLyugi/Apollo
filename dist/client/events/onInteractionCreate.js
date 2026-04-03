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
exports.onInteractionCreate = void 0;
const commands_1 = require("../commands");
const modals_1 = require("../modals");
const localization_1 = require("../../utils/localization");
const onInteractionCreate = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const commandMap = new Map();
    commands_1.commands.forEach(command => commandMap.set(command.data.name, command));
    const modalsMap = new Map();
    modals_1.modals.forEach(modal => modalsMap.set(modal.data.name, modal));
    const locale = (0, localization_1.mapLocale)(interaction.locale);
    if (interaction.isModalSubmit()) {
        const modalName = interaction.customId;
        const modal = modalsMap.get(modalName);
        if (!modal)
            return console.log(`\x1b[32m%s\x1b[0m`, `Modal ${modalName} not found!`);
        try {
            yield modal.execute(interaction);
        }
        catch (error) {
            console.error(error);
            yield interaction.reply({ content: (0, localization_1.t)(`client.error_on_command`, locale), ephemeral: true });
        }
    }
    if (interaction.isChatInputCommand()) {
        const commandName = interaction.commandName;
        const command = commandMap.get(commandName);
        if (!command)
            return console.log(`\x1b[32m%s\x1b[0m`, `Command ${commandName} not found!`);
        try {
            yield command.execute(interaction);
        }
        catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            yield interaction.reply({ content: (0, localization_1.t)(`client.error_on_command`, locale), ephemeral: true });
        }
    }
});
exports.onInteractionCreate = onInteractionCreate;
