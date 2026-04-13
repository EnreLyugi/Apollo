import { AttachmentBuilder, Collection, EmbedBuilder, Message, MessageFlags, TextChannel } from 'discord.js';
import { xpService } from '../../services/';
import ticketService from '../../services/ticketService';
import { colors } from '../../config';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

function buildTicketEmbed(authorName: string, authorIcon: string | undefined, content: string, attachments: Collection<string, any>) {
    const embed = new EmbedBuilder()
        .setColor(parseInt(colors.default_color, 16))
        .setAuthor({ name: authorName, iconURL: authorIcon })
        .setDescription(content || '*sem conteúdo*')
        .setTimestamp();

    const firstImage = attachments.find(a =>
        IMAGE_EXTENSIONS.some(ext => a.name?.toLowerCase().endsWith(ext))
    );
    if (firstImage) {
        embed.setImage(firstImage.url);
    }

    return embed;
}

function buildAttachmentFiles(attachments: Collection<string, any>) {
    return attachments.map(a => new AttachmentBuilder(a.url, { name: a.name || 'file' }));
}

export const onMessageCreate = async (message: Message) => {
    if (message.author.bot) return;

    if (!message.guild) {
        const ticket = await ticketService.getOpenTicketByUserId(message.author.id);
        if (!ticket) return;

        if (!message.content && message.attachments.size === 0) return;

        try {
            const guild = message.client.guilds.cache.find(g => g.channels.cache.has(ticket.channel_id));
            if (!guild) return;

            const channel = guild.channels.resolve(ticket.channel_id) as TextChannel | null;
            if (!channel) return;

            const embed = buildTicketEmbed(
                message.author.tag,
                message.author.displayAvatarURL(),
                message.content,
                message.attachments
            );

            const files = buildAttachmentFiles(message.attachments);

            await channel.send({ embeds: [embed], files });
        } catch (e) {
            console.error('Error relaying DM to ticket channel:', e);
        }
        return;
    }

    const user = message.member?.user;
    const guild = message.guild;

    if (!user || user.bot) return;

    const ticket = await ticketService.getTicketByChannel(message.channel.id);
    if (ticket) {
        if (!message.content && message.attachments.size === 0) return;

        try {
            const ticketUser = await message.client.users.fetch(ticket.user_id);

            const embed = buildTicketEmbed(
                guild.name,
                guild.iconURL() || undefined,
                message.content,
                message.attachments
            );

            const files = buildAttachmentFiles(message.attachments);

            await ticketUser.send({ embeds: [embed], files });
        } catch (e) {
            console.error('Error relaying ticket message to DM:', e);
        }
    }

    await xpService.handleXP(message.channel, guild, message.member);
};