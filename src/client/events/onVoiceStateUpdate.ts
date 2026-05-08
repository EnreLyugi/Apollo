import { VoiceState, GuildMember, GuildBasedChannel, Guild, VoiceBasedChannel } from "discord.js";
import { xpChannelService, guildService, xpService } from "../../services";
import { t, format, mapLocale } from '../../utils/localization';
import { Embed } from "../../models";
import client from "..";

const xpMembers: { member: GuildMember, guild: Guild, channel: VoiceBasedChannel }[] = [];

var xpInterval: any;

function getUnmutedMembersInVoiceChannel(guild: Guild, voiceChannelId: string): GuildMember[] {
    const list: GuildMember[] = [];
    for (const vs of guild.voiceStates.cache.values()) {
        if (vs.channelId !== voiceChannelId) continue;
        const m = vs.member;
        if (!m || m.user.bot) continue;
        if (vs.selfDeaf || vs.selfMute || vs.serverDeaf || vs.serverMute) continue;
        list.push(m);
    }
    return list;
}

async function clearXpQueueForChannelIfInvalid(guild: Guild, voiceChannelId: string) {
    const unmuted = getUnmutedMembersInVoiceChannel(guild, voiceChannelId);
    const isXpDisabled = await xpChannelService.getChannel(voiceChannelId, guild.id);
    if (unmuted.length >= 2 && !isXpDisabled) return;

    const toDrop = xpMembers.filter((x) => x.guild.id === guild.id && x.channel.id === voiceChannelId);
    for (const x of toDrop) {
        console.log(`[xp voice] ${x.member.displayName} removed from queue (need 2+ unmuted or xp off channel)`);
        removeMember(x.member, guild);
    }
}

export const onVoiceStateUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    const guild = newState.guild;
    const guildData = await guildService.createGuildIfNotExists(guild.id);

    if(!member) return;
    if(member.user.bot) return;

    if(guildData.voice_activity_log_channel) {
        const logChannel = guild.channels.resolve(guildData.voice_activity_log_channel);
        if(logChannel?.isTextBased()) {
            activityLog(oldState, newState, logChannel);
        }
    }

    if (oldState.channelId && oldState.channelId !== newState.channelId) {
        await clearXpQueueForChannelIfInvalid(guild, oldState.channelId);
    }

    const channel = newState.channel;
    if (!channel?.isVoiceBased()) {
        if (xpMembers.some((x) => x.member.id === member.id && x.guild.id === guild.id)) {
            console.log(`[xp voice] ${member.displayName} removed from queue (left voice)`);
        }
        removeMember(member, guild);
        return;
    }

    const voiceChannelId = channel.id;
    const unmutedMembers = getUnmutedMembersInVoiceChannel(guild, voiceChannelId);

    const isXpDisabled = await xpChannelService.getChannel(channel.id, member.guild.id);

    if(unmutedMembers.length < 2  || isXpDisabled) {
        unmutedMembers.forEach((m) => {
            if (xpMembers.some((x) => x.member.id === m.id && x.guild.id === guild.id)) {
                console.log(`[xp voice] ${m.displayName} removed from queue (need 2+ unmuted or xp off channel)`);
                removeMember(m, guild);
            }
        });
        if (xpMembers.some((x) => x.member.id === member.id && x.guild.id === guild.id)) {
            console.log(`[xp voice] ${member.displayName} removed from queue (need 2+ unmuted or xp off channel)`);
            removeMember(member, guild);
        }
        return;
    }

    if (newState.selfDeaf || newState.selfMute || newState.serverDeaf || newState.serverMute) {
        if (xpMembers.some((x) => x.member.id === member.id && x.guild.id === guild.id)) {
            console.log(`[xp voice] ${member.displayName} removed from queue (muted/deafened)`);
            removeMember(member, guild);
        }
        return;
    }

    for (const m of unmutedMembers) {
        if (!xpMembers.some((x) => x.member.id === m.id && x.guild.id === guild.id)) {
            console.log(`[xp voice] ${m.displayName} added to queue`);
            xpMembers.push({ member: m, guild, channel });
        }
    }

    if(!xpInterval) {
        xpInterval = setInterval(() => {
            xpMembers.forEach(async ({ member, guild, channel }) => {
                await xpService.handleXP(channel, guild, member);
            });
        }, 10000);
    }
    return;
}

function removeMember(member: GuildMember, guild: Guild) {
    const index = xpMembers.findIndex((x) => x.member.id === member.id && x.guild.id === guild.id);

    if(index !== -1) {
        xpMembers.splice(index, 1);
    }

    if(xpMembers.length === 0) {
        clearInterval(xpInterval);
        xpInterval = null;
    }

    return;
}

function activityLog(oldState: VoiceState, newState: VoiceState, logChannel: GuildBasedChannel) {
    if(!logChannel.isTextBased()) return

    const guild = newState.guild;
    const member = newState.member;

    if(!member || !guild) return

    const locale = mapLocale(guild.preferredLocale);

    const embed = new Embed()
        .setFooter({ text: member.id, iconURL: guild.iconURL() || undefined })
        .setTimestamp(new Date())

    if(!oldState.channel && newState.channel) { // User joined a call
        const description = format(t(`logs.voice_activity.joined_channel`, locale), {
            username: `${member}`,
            channel: `${newState.channel}`
        });

        embed
            .setColor('#32FF32')
            .setAuthor({ name: t(`logs.voice_activity.joined_channel_title`, locale), iconURL: member.displayAvatarURL() })
            .setDescription(description)
    } else if(oldState.channel && !newState.channel) { // User left a call
        const description = format(t(`logs.voice_activity.left_channel`, locale), {
            username: `${member}`,
            channel: `${oldState.channel}`
        });

        embed
            .setColor('#FF3232')
            .setAuthor({ name: t(`logs.voice_activity.left_channel_title`, locale), iconURL: member.displayAvatarURL() })
            .setDescription(description)
    } else if(oldState.channelId !== newState.channelId) { // User changed channel
        const description = format(t(`logs.voice_activity.changed_channel`, locale), {
            username: `${member}`,
            channel1: `${oldState.channel}`,
            channel2: `${newState.channel}`
        });

        embed
            .setColor('#FFFF32')
            .setAuthor({ name: t(`logs.voice_activity.changed_channel_title`, locale), iconURL: member.displayAvatarURL() })
            .setDescription(description)
    } else {
        return;
    }
    

    

}