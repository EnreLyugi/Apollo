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
exports.shop = void 0;
const discord_js_1 = require("discord.js");
const localization_1 = require("../../utils/localization");
const services_1 = require("../../services");
const models_1 = require("../../models");
const nextPage_1 = require("../buttons/nextPage");
const previousPage_1 = require("../buttons/previousPage");
const config_1 = require("../../config");
const help_1 = require("./help");
exports.shop = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('shop')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.shop.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.shop.name', 'pt-BR')
    })
        .setDescription('Some shops to spend your coins')
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.shop.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.shop.description', 'pt-BR')
    })
        .addStringOption(new discord_js_1.SlashCommandStringOption()
        .setName('type')
        .setNameLocalizations({
        "en-US": (0, localization_1.t)('commands.shop.options.type.name', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.shop.options.type.name', 'pt-BR')
    })
        .setDescription((0, localization_1.t)('commands.shop.options.type.description', 'en-US'))
        .setDescriptionLocalizations({
        "en-US": (0, localization_1.t)('commands.shop.options.type.description', 'en-US'),
        "pt-BR": (0, localization_1.t)('commands.shop.options.type.description', 'pt-BR')
    })
        .setChoices([
        {
            "name": "roles",
            "name_localizations": {
                "en-US": (0, localization_1.t)('commands.shop.options.type.choices.roles.name', 'en-US'),
                "pt-BR": (0, localization_1.t)('commands.shop.options.type.choices.roles.name', 'pt-BR')
            },
            "value": "roles"
        }
    ])
        .setRequired(true)),
    category: help_1.CommandCategory.ECONOMY,
    usage: '/shop',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const shopType = interaction.options.getString('type');
        const guild = interaction.guild;
        if (!guild || !shopType)
            return;
        const locale = (0, localization_1.mapLocale)(interaction.locale);
        if (shopType == "roles") {
            const roles = yield services_1.colorRoleService.getGuildRoles(guild.id);
            if (!roles)
                return;
            const pageSize = 10;
            let currentPage = 0;
            const updateEmbed = (page) => {
                const embed = new models_1.Embed()
                    .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
                    .setColor(`#${config_1.colors.default_color}`)
                    .setFooter({ text: (0, localization_1.t)('commands.shop.options.type.choices.roles.response.footer', locale) })
                    .setTimestamp(new Date())
                    .setTitle((0, localization_1.t)('commands.shop.options.type.choices.roles.response.title', locale));
                let rolelist = '';
                for (let i = page * pageSize; i < (page + 1) * pageSize; i++) {
                    if (!roles[i])
                        continue;
                    rolelist += `${i + 1}. <@&${roles[i].role_id}> (**${roles[i].name}**)\n`;
                }
                embed.setDescription(rolelist);
                return embed;
            };
            const components = (page) => {
                const buttons = new discord_js_1.ActionRowBuilder();
                if (page > 0)
                    buttons.addComponents(previousPage_1.previousPageButton);
                if ((page + 1) * pageSize < roles.length)
                    buttons.addComponents(nextPage_1.nextPageButton);
                return [buttons];
            };
            yield interaction.reply({
                embeds: [updateEmbed(currentPage).build()],
                components: components(currentPage),
                ephemeral: true
            });
            const collector = (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({ time: 60000 });
            collector === null || collector === void 0 ? void 0 : collector.on('collect', (buttonInteraction) => __awaiter(void 0, void 0, void 0, function* () {
                if (buttonInteraction.user.id !== interaction.user.id) {
                    return buttonInteraction.reply({ content: 'Você não pode usar esses botões.', ephemeral: true });
                }
                if (buttonInteraction.customId === 'nextPageButton') {
                    currentPage++;
                }
                else if (buttonInteraction.customId === 'previousPageButton') {
                    currentPage--;
                }
                yield buttonInteraction.update({
                    embeds: [updateEmbed(currentPage).build()],
                    components: components(currentPage)
                });
            }));
            collector === null || collector === void 0 ? void 0 : collector.on('end', () => {
                interaction.editReply({ components: [] });
            });
        }
    }),
};
