import { EmbedBuilder, Message, TextChannel } from 'discord.js';
import { xpService } from '../../services/';
import ticketService from '../../services/ticketService';
import { colors } from '../../config';

export const onMessageCreate = async (message: Message) => {
    if (message.author.bot) return;

    if (!message.guild) {
        const ticket = await ticketService.getOpenTicketByUserId(message.author.id);
        if (!ticket) return;

        try {
            const guild = message.client.guilds.cache.find(g => g.channels.cache.has(ticket.channel_id));
            if (!guild) return;

            const channel = guild.channels.resolve(ticket.channel_id) as TextChannel | null;
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor(parseInt(colors.default_color, 16))
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(message.content || '*sem conteúdo*')
                .setTimestamp();

            const files = message.attachments.map(a => a.url);

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
        try {
            const ticketUser = await message.client.users.fetch(ticket.user_id);

            const embed = new EmbedBuilder()
                .setColor(parseInt(colors.default_color, 16))
                .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
                .setDescription(message.content || '*sem conteúdo*')
                .setTimestamp();

            const files = message.attachments.map(a => a.url);

            await ticketUser.send({ embeds: [embed], files });
        } catch (e) {
            console.error('Error relaying ticket message to DM:', e);
        }
    }

    await xpService.handleXP(message.channel, guild, message.member);
};