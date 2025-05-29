import { VoiceState, GuildMember, GuildBasedChannel, Guild, VoiceBasedChannel } from "discord.js";
import { xpChannelService, guildService, xpService } from "../../services";
import { t, format, mapLocale } from '../../utils/localization';
import { Embed } from "../../models";

const xpMembers: { member: GuildMember, guild: Guild, channel: VoiceBasedChannel }[] = [];

var xpInterval: any;

export const onVoiceStateUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    const guild = newState.guild;
    const guildData = await guildService.createGuildIfNotExists(guild.id);

    if(!member) return;
    if(member.user.bot) return;

    if(guildData.voice_activity_log_channel) { // Voice Activity Log
        const logChannel = guild.channels.resolve(guildData.voice_activity_log_channel);
        if(!logChannel) return;
        if(!logChannel.isTextBased) return;
        activityLog(oldState, newState, logChannel);
    }

    const channel = newState.channel;
    if(!channel) {
        removeMember(member, guild);
        return;
    };

    let unmutedMembers: any[] = [];

    channel.members.map(member => {
        const voice = member.voice
        if (voice.selfDeaf || voice.selfMute || voice.serverDeaf || voice.serverMute || member.user.bot) return;
        unmutedMembers.push(member);
    });

    const isXpDisabled = await xpChannelService.getChannel(channel.id, member.guild.id);

    if(unmutedMembers.length < 2  || isXpDisabled) {
        unmutedMembers.forEach(member => {
            if(xpMembers.some(x => x.member.id === member.id && x.guild.id === guild.id)) {
                console.log(`${member.displayName} removed from queue`);
                removeMember(member, channel.guild);
            }
        });
        if(xpMembers.some(x => x.member.id === member.id && x.guild.id === guild.id)) {
            console.log(`${member.displayName} removed from queue`);
            removeMember(member, channel.guild);
        }
        return;
    }

    if(newState.selfDeaf || newState.selfMute || newState.serverDeaf || newState.serverMute) {
        if(xpMembers.some(x => x.member.id === member.id && x.guild.id === guild.id)) {
            console.log(`${member.displayName} removed from queue`);
            removeMember(member, channel.guild);
        }
        return;
    }

    unmutedMembers.map(member => {
        if(!xpMembers.some(x => x.member.id === member.id && x.guild.id === guild.id)) {
            console.log(`${member.displayName} added to queue`);
            xpMembers.push({ member, guild, channel });
        }
    });

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
    const index = xpMembers.findIndex(x => x.member.id === member.id && guild.id === guild.id);

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

    logChannel.send({ embeds: [ embed.build() ] });
}