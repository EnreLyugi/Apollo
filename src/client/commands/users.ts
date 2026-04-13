import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    GuildMember,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { Embed } from "../../models";
import { nextPageButton } from "../buttons/nextPage";
import { previousPageButton } from "../buttons/previousPage";
import { colors } from "../../config";
import { CommandCategory } from "./help";

const PAGE_SIZE = 15;

function buildPage(members: GuildMember[], page: number, guildName: string, guildIcon: string | null, totalPages: number) {
    const start = page * PAGE_SIZE;
    const slice = members.slice(start, start + PAGE_SIZE);

    const description = slice
        .map((m, i) => {
            const avatarUrl = m.user.displayAvatarURL({ size: 4096, extension: 'png' });
            return `**${start + i + 1}.** [${m.user.tag}](${avatarUrl})`;
        })
        .join('\n');

    return new Embed()
        .setAuthor({ name: guildName, iconURL: guildIcon || undefined })
        .setColor(`#${colors.default_color}`)
        .setTitle('Membros do Servidor')
        .setDescription(description)
        .setFooter({ text: `Página ${page + 1}/${totalPages} • ${members.length} membros` })
        .setTimestamp(new Date());
}

function buildButtons(page: number, totalPages: number) {
    const row = new ActionRowBuilder();
    if (page > 0) row.addComponents(previousPageButton);
    if (page < totalPages - 1) row.addComponents(nextPageButton);
    return [row as any];
}

export const users = {
    data: new SlashCommandBuilder()
        .setName('users')
        .setDescription('Lista todos os membros do servidor')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    category: CommandCategory.UTILITY,
    usage: '/users',
    execute: async (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild;
        if (!guild) return;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const fetched = await guild.members.fetch();
        const members = [...fetched.values()]
            .filter(m => !m.user.bot)
            .sort((a, b) => a.user.username.localeCompare(b.user.username));

        if (members.length === 0) {
            await interaction.editReply({ content: 'Nenhum membro encontrado.' });
            return;
        }

        const totalPages = Math.ceil(members.length / PAGE_SIZE);
        let currentPage = 0;

        await interaction.editReply({
            embeds: [buildPage(members, currentPage, guild.name, guild.iconURL(), totalPages).build()],
            components: totalPages > 1 ? buildButtons(currentPage, totalPages) : []
        });

        if (totalPages <= 1) return;

        const collector = interaction.channel?.createMessageComponentCollector({ time: 120_000 });

        collector?.on('collect', async (btn) => {
            if (btn.user.id !== interaction.user.id) {
                return btn.reply({ content: 'Você não pode usar esses botões.', flags: MessageFlags.Ephemeral });
            }

            if (btn.customId === 'nextPageButton') currentPage++;
            else if (btn.customId === 'previousPageButton') currentPage--;

            await btn.update({
                embeds: [buildPage(members, currentPage, guild.name, guild.iconURL(), totalPages).build()],
                components: buildButtons(currentPage, totalPages)
            });
        });

        collector?.on('end', () => {
            interaction.editReply({ components: [] });
        });
    },
};
