import {
    EmbedBuilder,
    Message,
    TextChannel,
} from 'discord.js';
import { xpService } from '../../services/';
import ticketService from '../../services/ticketService';
import { colors } from '../../config';

/** Extensões tratadas como imagem no embed. */
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

/** Evita repetir no nosso embed o mesmo URL que já vem no embed de pré-visualização do Discord (Tenor, etc.). */
function urlsMatchLine(line: string, embedUrl: string): boolean {
    const t = line.trim();
    if (!t || !embedUrl) return false;
    if (t === embedUrl) return true;
    try {
        const a = new URL(t);
        const b = new URL(embedUrl);
        return a.origin === b.origin && a.pathname === b.pathname;
    } catch {
        return false;
    }
}

function stripContentDuplicatedByLinkEmbeds(content: string, message: Message): string {
    if (!content.trim() || message.embeds.length === 0) return content;

    const embedUrls = message.embeds.map((e) => e.url).filter((u): u is string => Boolean(u));
    if (embedUrls.length === 0) return content;

    const lines = content.split('\n');
    const kept = lines.filter((line) => {
        const t = line.trim();
        if (!t) return true;
        return !embedUrls.some((u) => urlsMatchLine(t, u));
    });
    return kept.join('\n').trim();
}

function shouldRelayTicketMessage(message: Message): boolean {
    return (
        Boolean(message.content?.trim()) ||
        message.attachments.size > 0 ||
        message.stickers.size > 0 ||
        message.embeds.length > 0
    );
}

function isImageAttachment(a: { name: string | null }): boolean {
    const n = a.name?.toLowerCase() ?? '';
    return IMAGE_EXTENSIONS.some((ext) => n.endsWith(ext));
}

/**
 * Anexos só aparecem no embed: imagens/figurinhas via setImage (principal + embeds extra);
 * outros ficheiros como links na descrição. Sem ficheiros ao nível da mensagem.
 */
function buildRelayEmbeds(authorName: string, authorIcon: string | undefined, message: Message): EmbedBuilder[] {
    const color = parseInt(colors.default_color, 16);
    const attachmentList = [...message.attachments.values()];
    const imageAttachments = attachmentList.filter(isImageAttachment);
    const fileOnly = attachmentList.filter((a) => !isImageAttachment(a));

    let description = message.content?.trim() || '';
    description = stripContentDuplicatedByLinkEmbeds(description, message);

    if (message.stickers.size > 0) {
        const stickerLines = [...message.stickers.values()]
            .map((s) => `🎭 *${s.name}*`)
            .join('\n');
        description = description ? `${description}\n\n${stickerLines}` : stickerLines;
    }

    if (fileOnly.length > 0) {
        const links = fileOnly.map((a) => `[${a.name || 'ficheiro'}](${a.url})`).join('\n');
        description = description ? `${description}\n\n**Ficheiros:**\n${links}` : `**Ficheiros:**\n${links}`;
    }

    const visualUrls: string[] = [
        ...imageAttachments.map((a) => a.url),
        ...[...message.stickers.values()].map((s) => s.url),
    ];

    if (!description.trim()) {
        if (visualUrls.length > 0) {
            description = '*Mídia*';
        } else if (message.embeds.length > 0) {
            description = '*Pré-visualização abaixo*';
        } else {
            description = '*sem conteúdo*';
        }
    }

    const main = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: authorName, iconURL: authorIcon })
        .setDescription(description)
        .setTimestamp();

    if (visualUrls.length > 0) {
        main.setImage(visualUrls[0]);
    }

    const extra: EmbedBuilder[] = [];
    for (let i = 1; i < visualUrls.length; i++) {
        extra.push(new EmbedBuilder().setColor(color).setImage(visualUrls[i]));
    }

    return [main, ...extra];
}

/** Até 10 embeds no total: os nossos + pré-visualizações de links (etc.) do utilizador. */
function combineEmbeds(authorEmbeds: EmbedBuilder[], message: Message): EmbedBuilder[] {
    const maxFromUser = Math.max(0, 10 - authorEmbeds.length);
    const fromUser = message.embeds.slice(0, maxFromUser).map((e) => EmbedBuilder.from(e));
    return [...authorEmbeds, ...fromUser];
}

export const onMessageCreate = async (message: Message) => {
    if (message.author.bot) return;

    if (!message.guild) {
        let msg = message;
        if (msg.partial) {
            try {
                msg = await msg.fetch();
            } catch (e) {
                console.error('[ticket DM] falha ao obter mensagem completa:', e);
                return;
            }
        }

        const ticket = await ticketService.getOpenTicketByUserId(msg.author.id);
        if (!ticket) return;

        if (!shouldRelayTicketMessage(msg)) return;

        try {
            const guild = await msg.client.guilds.fetch(ticket.guild_id).catch((e) => {
                console.error('[ticket DM] falha ao obter servidor:', ticket.guild_id, e);
                return null;
            });
            if (!guild) return;

            const resolved = await guild.channels.fetch(ticket.channel_id).catch((e) => {
                console.error('[ticket DM] falha ao obter canal do ticket:', ticket.channel_id, e);
                return null;
            });
            if (!resolved || !resolved.isTextBased()) return;

            const channel = resolved as TextChannel;

            const authorEmbeds = buildRelayEmbeds(msg.author.tag, msg.author.displayAvatarURL(), msg);
            const embeds = combineEmbeds(authorEmbeds, msg);

            await channel.send({ embeds });
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
        if (!shouldRelayTicketMessage(message)) return;

        try {
            const ticketUser = await message.client.users.fetch(ticket.user_id);

            const authorEmbeds = buildRelayEmbeds(guild.name, guild.iconURL() || undefined, message);
            const embeds = combineEmbeds(authorEmbeds, message);

            await ticketUser.send({ embeds });
        } catch (e) {
            console.error('Error relaying ticket message to DM:', e);
        }
    }

    await xpService.handleXP(message.channel, guild, message.member);
};
