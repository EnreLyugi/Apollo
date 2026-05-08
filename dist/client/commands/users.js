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
exports.users = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models");
const nextPage_1 = require("../buttons/nextPage");
const previousPage_1 = require("../buttons/previousPage");
const config_1 = require("../../config");
const help_1 = require("./help");
const PAGE_SIZE = 15;
function buildPage(members, page, guildName, guildIcon, totalPages) {
    const start = page * PAGE_SIZE;
    const slice = members.slice(start, start + PAGE_SIZE);
    const description = slice
        .map((m, i) => {
        const avatarUrl = m.user.displayAvatarURL({ size: 4096, extension: 'png' });
        return `**${start + i + 1}.** [${m.user.tag}](${avatarUrl})`;
    })
        .join('\n');
    return new models_1.Embed()
        .setAuthor({ name: guildName, iconURL: guildIcon || undefined })
        .setColor(`#${config_1.colors.default_color}`)
        .setTitle('Membros do Servidor')
        .setDescription(description)
        .setFooter({ text: `Página ${page + 1}/${totalPages} • ${members.length} membros` })
        .setTimestamp(new Date());
}
function buildButtons(page, totalPages) {
    const row = new discord_js_1.ActionRowBuilder();
    if (page > 0)
        row.addComponents(previousPage_1.previousPageButton);
    if (page < totalPages - 1)
        row.addComponents(nextPage_1.nextPageButton);
    return [row];
}
exports.users = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('users')
        .setDescription('Lista todos os membros do servidor')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator),
    category: help_1.CommandCategory.UTILITY,
    usage: '/users',
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const guild = interaction.guild;
        if (!guild)
            return;
        yield interaction.deferReply({ flags: discord_js_1.MessageFlags.Ephemeral });
        const fetched = yield guild.members.fetch();
        const members = [...fetched.values()]
            .filter(m => !m.user.bot)
            .sort((a, b) => a.user.username.localeCompare(b.user.username));
        if (members.length === 0) {
            yield interaction.editReply({ content: 'Nenhum membro encontrado.' });
            return;
        }
        const totalPages = Math.ceil(members.length / PAGE_SIZE);
        let currentPage = 0;
        yield interaction.editReply({
            embeds: [buildPage(members, currentPage, guild.name, guild.iconURL(), totalPages).build()],
            components: totalPages > 1 ? buildButtons(currentPage, totalPages) : []
        });
        if (totalPages <= 1)
            return;
        const collector = (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({ time: 120000 });
        collector === null || collector === void 0 ? void 0 : collector.on('collect', (btn) => __awaiter(void 0, void 0, void 0, function* () {
            if (btn.user.id !== interaction.user.id) {
                return btn.reply({ content: 'Você não pode usar esses botões.', flags: discord_js_1.MessageFlags.Ephemeral });
            }
            if (btn.customId === 'nextPageButton')
                currentPage++;
            else if (btn.customId === 'previousPageButton')
                currentPage--;
            yield btn.update({
                embeds: [buildPage(members, currentPage, guild.name, guild.iconURL(), totalPages).build()],
                components: buildButtons(currentPage, totalPages)
            });
        }));
        collector === null || collector === void 0 ? void 0 : collector.on('end', () => {
            interaction.editReply({ components: [] });
        });
    }),
};
