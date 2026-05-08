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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onVoiceStateUpdate = void 0;
const services_1 = require("../../services");
const localization_1 = require("../../utils/localization");
const models_1 = require("../../models");
const __1 = __importDefault(require(".."));
const xpMembers = [];
var xpInterval;
function getUnmutedMembersInVoiceChannel(guild, voiceChannelId) {
    const list = [];
    for (const vs of guild.voiceStates.cache.values()) {
        if (vs.channelId !== voiceChannelId)
            continue;
        const m = vs.member;
        if (!m || m.user.bot)
            continue;
        if (vs.selfDeaf || vs.selfMute || vs.serverDeaf || vs.serverMute)
            continue;
        list.push(m);
    }
    return list;
}
function clearXpQueueForChannelIfInvalid(guild, voiceChannelId) {
    return __awaiter(this, void 0, void 0, function* () {
        const unmuted = getUnmutedMembersInVoiceChannel(guild, voiceChannelId);
        const isXpDisabled = yield services_1.xpChannelService.getChannel(voiceChannelId, guild.id);
        if (unmuted.length >= 2 && !isXpDisabled)
            return;
        const toDrop = xpMembers.filter((x) => x.guild.id === guild.id && x.channel.id === voiceChannelId);
        for (const x of toDrop) {
            console.log(`[xp voice] ${x.member.displayName} removed from queue (need 2+ unmuted or xp off channel)`);
            removeMember(x.member, guild);
        }
    });
}
const onVoiceStateUpdate = (oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
    const member = newState.member;
    const guild = newState.guild;
    const guildData = yield services_1.guildService.createGuildIfNotExists(guild.id);
    if (!member)
        return;
    if (member.user.bot)
        return;
    if (guildData.voice_activity_log_channel) {
        const logChannel = guild.channels.resolve(guildData.voice_activity_log_channel);
        if (logChannel === null || logChannel === void 0 ? void 0 : logChannel.isTextBased()) {
            activityLog(oldState, newState, logChannel);
        }
    }
    if (oldState.channelId && oldState.channelId !== newState.channelId) {
        yield clearXpQueueForChannelIfInvalid(guild, oldState.channelId);
    }
    const channel = newState.channel;
    if (!(channel === null || channel === void 0 ? void 0 : channel.isVoiceBased())) {
        if (xpMembers.some((x) => x.member.id === member.id && x.guild.id === guild.id)) {
            console.log(`[xp voice] ${member.displayName} removed from queue (left voice)`);
        }
        removeMember(member, guild);
        return;
    }
    const voiceChannelId = channel.id;
    const unmutedMembers = getUnmutedMembersInVoiceChannel(guild, voiceChannelId);
    const isXpDisabled = yield services_1.xpChannelService.getChannel(channel.id, member.guild.id);
    if (unmutedMembers.length < 2 || isXpDisabled) {
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
    if (!xpInterval) {
        xpInterval = setInterval(() => {
            xpMembers.forEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ member, guild, channel }) {
                yield services_1.xpService.handleXP(channel, guild, member);
            }));
        }, 10000);
    }
    return;
});
exports.onVoiceStateUpdate = onVoiceStateUpdate;
function removeMember(member, guild) {
    const index = xpMembers.findIndex((x) => x.member.id === member.id && x.guild.id === guild.id);
    if (index !== -1) {
        xpMembers.splice(index, 1);
    }
    if (xpMembers.length === 0) {
        clearInterval(xpInterval);
        xpInterval = null;
    }
    return;
}
function activityLog(oldState, newState, logChannel) {
    if (!logChannel.isTextBased())
        return;
    const guild = newState.guild;
    const member = newState.member;
    if (!member || !guild)
        return;
    const locale = (0, localization_1.mapLocale)(guild.preferredLocale);
    const embed = new models_1.Embed()
        .setFooter({ text: member.id, iconURL: guild.iconURL() || undefined })
        .setTimestamp(new Date());
    if (!oldState.channel && newState.channel) { // User joined a call
        const description = (0, localization_1.format)((0, localization_1.t)(`logs.voice_activity.joined_channel`, locale), {
            username: `${member}`,
            channel: `${newState.channel}`
        });
        embed
            .setColor('#32FF32')
            .setAuthor({ name: (0, localization_1.t)(`logs.voice_activity.joined_channel_title`, locale), iconURL: member.displayAvatarURL() })
            .setDescription(description);
    }
    else if (oldState.channel && !newState.channel) { // User left a call
        const description = (0, localization_1.format)((0, localization_1.t)(`logs.voice_activity.left_channel`, locale), {
            username: `${member}`,
            channel: `${oldState.channel}`
        });
        embed
            .setColor('#FF3232')
            .setAuthor({ name: (0, localization_1.t)(`logs.voice_activity.left_channel_title`, locale), iconURL: member.displayAvatarURL() })
            .setDescription(description);
    }
    else if (oldState.channelId !== newState.channelId) { // User changed channel
        const description = (0, localization_1.format)((0, localization_1.t)(`logs.voice_activity.changed_channel`, locale), {
            username: `${member}`,
            channel1: `${oldState.channel}`,
            channel2: `${newState.channel}`
        });
        embed
            .setColor('#FFFF32')
            .setAuthor({ name: (0, localization_1.t)(`logs.voice_activity.changed_channel_title`, locale), iconURL: member.displayAvatarURL() })
            .setDescription(description);
    }
    else {
        return;
    }
    logChannel.send({ embeds: [embed.build()] });
    //console.log(embed.description);
    if (guild.id === '1324492982581203037') {
        const logGuild = __1.default.guilds.cache.get('1249736903691997275');
        if (!logGuild)
            return;
        const logChannel = logGuild.channels.resolve('1412999466323148860');
        if (!logChannel)
            return;
        if (!logChannel.isTextBased())
            return;
        logChannel.send({ embeds: [embed.build()] });
    }
}
