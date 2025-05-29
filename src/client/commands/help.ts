import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandStringOption,
    ApplicationCommand
} from "discord.js";
import { Embed } from '../../models/'
import { commands } from './';
import { mapLocale, t, format } from "../../utils/localization";
import { colors } from "../../config";
import * as fs from 'fs';
import * as path from 'path';

export enum CommandCategory {
    MUSIC = 'music',
    ECONOMY = 'economy',
    XP = 'xp',
    CONFIG = 'config',
    FUN = 'fun',
    UTILITY = 'utility'
}

interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    category: CommandCategory;
}

// Função para descobrir variações de um comando
function findCommandVariations(commandName: string): string[] {
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => 
        file.endsWith('.ts') && !file.startsWith('index') && !file.startsWith('help')
    );

    // Procura por arquivos que começam com o mesmo nome base
    const variations = commandFiles
        .filter(file => file.toLowerCase().startsWith(commandName.toLowerCase()))
        .map(file => file.replace('.ts', ''));

    return variations.length > 1 ? variations : [];
}

// Função para descobrir automaticamente todos os comandos
function discoverCommands(): { name: string; value: string }[] {
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => 
        file.endsWith('.ts') && !file.startsWith('index') && !file.startsWith('help')
    );

    // Filtra comandos para evitar duplicatas de variações
    const processedCommands = new Set<string>();
    const availableCommands: { name: string; value: string }[] = [];

    for (const file of commandFiles) {
        const commandName = file.replace('.ts', '').toLowerCase();
        const baseName = commandName.replace(/user$|admin$/, ''); // Remove sufixos comuns de variações

        if (!processedCommands.has(baseName)) {
            availableCommands.push({ name: commandName, value: commandName });
            processedCommands.add(baseName);
        }
    }

    // Adiciona o comando help
    availableCommands.push({ name: 'help', value: 'help' });

    return availableCommands;
}

// Lista de comandos disponíveis
const availableCommands = discoverCommands();

export const help: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setNameLocalizations({
            "en-US": t('commands.help.name', 'en-US'),
            "pt-BR": t('commands.help.name', 'pt-BR')
        })
        .setDescription('Shows command help')
        .setDescriptionLocalizations({
            "en-US": t('commands.help.description', 'en-US'),
            "pt-BR": t('commands.help.description', 'pt-BR')
        })
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName('command')
                .setNameLocalizations({
                    "en-US": t('commands.help.options.command.name', 'en-US'),
                    "pt-BR": t('commands.help.options.command.name', 'pt-BR')
                })
                .setDescription('Specific command to get help for')
                .setDescriptionLocalizations({
                    "en-US": t('commands.help.options.command.description', 'en-US'),
                    "pt-BR": t('commands.help.options.command.description', 'pt-BR')
                })
                .setRequired(false)
                .addChoices(
                    ...availableCommands.map(cmd => ({
                        name: t(`commands.${cmd.name}.name`, 'en-US'),
                        name_localizations: {
                            "pt-BR": t(`commands.${cmd.name}.name`, 'pt-BR')
                        },
                        value: cmd.value
                    }))
                )
        ) as SlashCommandBuilder,
    category: CommandCategory.UTILITY,
    execute: async (interaction: ChatInputCommandInteraction) => {
        const locale = mapLocale(interaction.locale);
        const commandName = interaction.options.getString('command');
        
        if (commandName) {
            // Mostra ajuda detalhada para um comando específico
            const command = commands.find(cmd => cmd.data.name === commandName);
            if (!command) return;

            const commandInfo = new Embed()
                .setColor(`#${colors.default_color}`)
                .setTitle(format(t('commands.help.specific_command.title', locale), {
                    command: t(`commands.${command.data.name}.name`, locale)
                }))
                .setDescription(format(t('commands.help.specific_command.template', locale), {
                    commandDescription: command.data.description_localizations?.[interaction.locale] || command.data.description,
                    commandUsage: t(`commands.${command.data.name}.usage`, locale)
                }));

            // Verifica se existem subcomandos no diretório
            const subcommandsPath = path.join(__dirname, 'subcommands', commandName);
            if (fs.existsSync(subcommandsPath)) {
                let subcommandsText = '\n\n' + t('commands.help.specific_command.subcommands_title', locale) + '\n';
                
                const subcommandFiles = fs.readdirSync(subcommandsPath)
                    .filter(file => file.endsWith('.ts') && !file.startsWith('index'));
                
                for (const file of subcommandFiles) {
                    const subName = file.replace('.ts', '');
                    const subCommand = t(`commands.${command.data.name}.subcommands.${subName}`, locale);
                    if (subCommand && typeof subCommand === 'object' && 'name' in subCommand && 'description' in subCommand) {
                        subcommandsText += `\`${(subCommand as { name: string; description: string }).name}\` - ${(subCommand as { name: string; description: string }).description}\n`;
                    }
                }
                
                const currentEmbed = commandInfo.build();
                commandInfo.setDescription((currentEmbed.data.description || '') + subcommandsText);
            }

            // Verifica se o comando tem variações
            const variations = findCommandVariations(commandName);
            if (variations.length > 0) {
                let variationsText = '\n\n' + t('commands.help.specific_command.variations_title', locale) + '\n';

                for (const variation of variations) {
                    const cmdName = t(`commands.${variation}.name`, locale);
                    const cmdDesc = t(`commands.${variation}.description`, locale);
                    variationsText += `\`/${cmdName}\` - ${cmdDesc}\n`;
                }

                const currentEmbed = commandInfo.build();
                commandInfo.setDescription((currentEmbed.data.description || '') + variationsText);
            }

            await interaction.reply({ embeds: [commandInfo.build()], ephemeral: true });
        } else {
            // Mostra lista simplificada de todos os comandos
            const commandList = new Embed()
                .setColor(`#${colors.default_color}`)
                .setTitle(t('commands.help.list.title', locale))
                .setDescription(t('commands.help.list.description', locale));

            // Agrupa comandos por categoria usando a categoria definida em cada comando
            const categories: Record<CommandCategory, string[]> = Object.values(CommandCategory).reduce((acc, category) => {
                acc[category] = [];
                return acc;
            }, {} as Record<CommandCategory, string[]>);

            // Adiciona cada comando à sua categoria
            for (const command of commands) {
                if ('category' in command) {
                    const baseName = command.data.name.replace(/user$|admin$/, '');
                    const category = command.category as CommandCategory;
                    if (!categories[category].includes(baseName)) {
                        categories[category].push(baseName);
                    }
                } else {
                    // Se não tiver categoria, adiciona em utility
                    categories[CommandCategory.UTILITY].push(command.data.name);
                }
            }

            // Adiciona o comando help à categoria utility
            if (!categories[CommandCategory.UTILITY].includes('help')) {
                categories[CommandCategory.UTILITY].push('help');
            }

            // Mostra os comandos agrupados por categoria
            for (const [category, categoryCommands] of Object.entries(categories)) {
                if (categoryCommands.length > 0) {
                    let categoryText = '';
                    
                    for (const cmdName of categoryCommands) {
                        const command = commands.find(cmd => cmd.data.name === cmdName);
                        if (command) {
                            const localizedName = t(`commands.${command.data.name}.name`, locale);
                            const localizedDescription = command.data.description_localizations?.[interaction.locale] 
                                || command.data.description;
                            categoryText += `\`/${localizedName}\` - ${localizedDescription}\n`;
                        }
                    }

                    if (categoryText) {
                        commandList.addField(
                            t(`commands.help.categories.${category}`, locale),
                            categoryText,
                            false
                        );
                    }
                }
            }

            commandList.setFooter({
                text: t('commands.help.list.footer', locale)
            });

            await interaction.reply({ embeds: [commandList.build()], ephemeral: true });
        }
    }
};