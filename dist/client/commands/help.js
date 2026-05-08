"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.help = exports.CommandCategory = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models/");
const _1 = require("./");
const localization_1 = require("../../utils/localization");
const config_1 = require("../../config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
var CommandCategory;
(function (CommandCategory) {
    CommandCategory["MUSIC"] = "music";
    CommandCategory["ECONOMY"] = "economy";
    CommandCategory["XP"] = "xp";
    CommandCategory["CONFIG"] = "config";
    CommandCategory["FUN"] = "fun";
    CommandCategory["UTILITY"] = "utility";
})(CommandCategory || (exports.CommandCategory = CommandCategory = {}));
// Function to discover command variations
function findCommandVariations(commandName) {
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') && !file.startsWith('index') && !file.startsWith('help'));
    // Procura por arquivos que começam com o mesmo nome base
    const variations = commandFiles
        .filter(file => file.toLowerCase().startsWith(commandName.toLowerCase()))
        .map(file => file.replace('.ts', ''));
    return variations.length > 1 ? variations : [];
}
// Function to automatically discover all commands
function discoverCommands() {
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') && !file.startsWith('index') && !file.startsWith('help'));
    // Filter commands to avoid variation duplicates
    const processedCommands = new Set();
    const availableCommands = [];
    for (const file of commandFiles) {
        const commandName = file.replace('.ts', '').toLowerCase();
        const baseName = commandName.replace(/user$|admin$/, ''); // Remove sufixos comuns de variações
        if (!processedCommands.has(baseName)) {
            availableCommands.push({ name: commandName, value: commandName });
            processedCommands.add(baseName);
        }
    }
    // Add help command
    availableCommands.push({ name: 'help', value: 'help' });
    return availableCommands;
}
// List of available commands
const availableCommands = discoverCommands();
exports.help = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('help')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.help.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.help.name', 'pt-BR')
    })
        .setDescription('Shows command help')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.help.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.help.description', 'pt-BR')
    })
        .addStringOption((option) => option
        .setName('command')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.help.options.command.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.help.options.command.name', 'pt-BR')
    })
        .setDescription('Specific command to get help for')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.help.options.command.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.help.options.command.description', 'pt-BR')
    })
        .setRequired(false)
        .addChoices(...availableCommands.map(cmd => ({
        name: (0, localization_1.t)(`commands.${cmd.name}.name`, 'en-US'),
        name_localizations: {
            "pt-BR": (0, localization_1.t)(`commands.${cmd.name}.name`, 'pt-BR')
        },
        value: cmd.value
    })))),
    category: CommandCategory.UTILITY,
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        const commandName = interaction.options.getString('command');
        if (commandName) {
            // Show detailed help for a specific command
            const command = _1.commands.find(cmd => cmd.data.name === commandName);
            if (!command)
                return;
            const commandInfo = new models_1.Embed()
                .setColor(`#${config_1.colors.default_color}`)
                .setTitle((0, localization_1.format)((0, localization_1.t)('commands.help.specific_command.title', locale), {
                command: (0, localization_1.t)(`commands.${command.data.name}.name`, locale)
            }))
                .setDescription((0, localization_1.format)((0, localization_1.t)('commands.help.specific_command.template', locale), {
                commandDescription: ((_a = command.data.description_localizations) === null || _a === void 0 ? void 0 : _a[interaction.locale]) || command.data.description,
                commandUsage: (0, localization_1.t)(`commands.${command.data.name}.usage`, locale)
            }));
            // Check if there are subcommands in the directory
            const subcommandsPath = path.join(__dirname, 'subcommands', commandName);
            if (fs.existsSync(subcommandsPath)) {
                let subcommandsText = '\n\n' + (0, localization_1.t)('commands.help.specific_command.subcommands_title', locale) + '\n';
                const subcommandFiles = fs.readdirSync(subcommandsPath)
                    .filter(file => file.endsWith('.ts') && !file.startsWith('index'));
                for (const file of subcommandFiles) {
                    const subName = file.replace('.ts', '');
                    const subCommand = (0, localization_1.t)(`commands.${command.data.name}.subcommands.${subName}`, locale);
                    if (subCommand && typeof subCommand === 'object' && 'name' in subCommand && 'description' in subCommand) {
                        subcommandsText += `\`${subCommand.name}\` - ${subCommand.description}\n`;
                    }
                }
                const currentEmbed = commandInfo.build();
                commandInfo.setDescription((currentEmbed.data.description || '') + subcommandsText);
            }
            // Check if command has variations
            const variations = findCommandVariations(commandName);
            if (variations.length > 0) {
                let variationsText = '\n\n' + (0, localization_1.t)('commands.help.specific_command.variations_title', locale) + '\n';
                for (const variation of variations) {
                    const cmdName = (0, localization_1.t)(`commands.${variation}.name`, locale);
                    const cmdDesc = (0, localization_1.t)(`commands.${variation}.description`, locale);
                    variationsText += `\`/${cmdName}\` - ${cmdDesc}\n`;
                }
                const currentEmbed = commandInfo.build();
                commandInfo.setDescription((currentEmbed.data.description || '') + variationsText);
            }
            yield interaction.reply({ embeds: [commandInfo.build()], flags: discord_js_1.MessageFlags.Ephemeral });
        }
        else {
            // Show simplified list of all commands
            const commandList = new models_1.Embed()
                .setColor(`#${config_1.colors.default_color}`)
                .setTitle((0, localization_1.t)('commands.help.list.title', locale))
                .setDescription((0, localization_1.t)('commands.help.list.description', locale));
            // Group commands by category using the category defined in each command
            const categories = Object.values(CommandCategory).reduce((acc, category) => {
                acc[category] = [];
                return acc;
            }, {});
            // Add each command to its category
            for (const command of _1.commands) {
                if ('category' in command) {
                    const baseName = command.data.name.replace(/user$|admin$/, '');
                    const category = command.category;
                    if (!categories[category].includes(baseName)) {
                        categories[category].push(baseName);
                    }
                }
                else {
                    // Se não tiver categoria, adiciona em utility
                    categories[CommandCategory.UTILITY].push(command.data.name);
                }
            }
            // Add help command to utility category
            if (!categories[CommandCategory.UTILITY].includes('help')) {
                categories[CommandCategory.UTILITY].push('help');
            }
            // Show commands grouped by category
            for (const [category, categoryCommands] of Object.entries(categories)) {
                if (categoryCommands.length > 0) {
                    let categoryText = '';
                    for (const cmdName of categoryCommands) {
                        const command = _1.commands.find(cmd => cmd.data.name === cmdName);
                        if (command) {
                            const localizedName = (0, localization_1.t)(`commands.${command.data.name}.name`, locale);
                            const localizedDescription = ((_b = command.data.description_localizations) === null || _b === void 0 ? void 0 : _b[interaction.locale])
                                || command.data.description;
                            categoryText += `\`/${localizedName}\` - ${localizedDescription}\n`;
                        }
                    }
                    if (categoryText) {
                        commandList.addField((0, localization_1.t)(`commands.help.categories.${category}`, locale), categoryText, false);
                    }
                }
            }
            commandList.setFooter({
                text: (0, localization_1.t)('commands.help.list.footer', locale)
            });
            yield interaction.reply({ embeds: [commandList.build()], flags: discord_js_1.MessageFlags.Ephemeral });
        }
    })
};
