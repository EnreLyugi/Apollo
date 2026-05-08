import { DMChannel, GuildChannel } from "discord.js";
import { guildService } from "../../services";

const CHANNEL_FIELDS = [
    'welcome_channel',
    'birthday_channel',
    'leave_channel',
    'mod_log_channel',
    'message_log_channel',
    'voice_activity_log_channel',
    'ticket_channel',
    'twitch_channel',
    'youtube_channel',
] as const;

export const onChannelDelete = async (channel: DMChannel | GuildChannel) => {
    if (channel.isDMBased()) return;

    const guildData = await guildService.getGuildById(channel.guild.id);
    if (!guildData) return;

    let changed = false;

    for (const field of CHANNEL_FIELDS) {
        if ((guildData as any)[field] === channel.id) {
            (guildData as any)[field] = null;
            changed = true;
        }
    }

    if (changed) {
        await guildData.save();
        console.log(`[channel-delete] Configurações de canal limpas para o canal deletado ${channel.name} em ${channel.guild.name}`);
    }
};
