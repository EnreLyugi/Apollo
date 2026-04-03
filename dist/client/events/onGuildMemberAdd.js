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
exports.onGuildMemberAdd = void 0;
const discord_js_1 = require("discord.js");
const models_1 = require("../../models");
const config_1 = require("../../config");
const services_1 = require("../../services");
const localization_1 = require("../../utils/localization");
const __1 = require("../");
const onGuildMemberAdd = (member) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (member.user.bot)
        return;
    const guild = member.guild;
    const welcomeSettings = yield services_1.welcomeSettingsService.fetch(guild.id);
    const hasBan = yield services_1.banService.getBan(member.user.id, guild.id);
    if (hasBan) {
        return member.ban();
    }
    if (welcomeSettings) {
        const embed = new models_1.Embed()
            .setColor(`#${config_1.colors.default_color}`)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
            .setThumbnail({ url: member.displayAvatarURL() || 'https://i.imgur.com/qlJnaP7.png' })
            .setTitle((0, localization_1.format)(welcomeSettings.title, {
            username: member.displayName,
            servername: guild.name
        }))
            .setDescription((0, localization_1.format)(welcomeSettings.description, {
            username: member.displayName,
            servername: guild.name
        }))
            .setFooter({ text: `${member.id}`, iconURL: member.displayAvatarURL() || 'https://i.imgur.com/qlJnaP7.png' })
            .setTimestamp(new Date())
            .build();
        if (welcomeSettings.image && welcomeSettings.image !== '' && typeof welcomeSettings.image === 'string') {
            embed.setImage(welcomeSettings.image);
        }
        const welcomeChannel = (_a = guild.channels) === null || _a === void 0 ? void 0 : _a.resolve(welcomeSettings.channel_id);
        if (!welcomeChannel || !welcomeChannel.isTextBased())
            return;
        welcomeChannel.send({ content: `${member}`, embeds: [embed] });
    }
    const welcomeRole = yield services_1.guildService.getRole('welcome_role', guild.id);
    if (welcomeRole !== null) {
        const role = member.guild.roles.resolve(welcomeRole.toString());
        if (!role)
            return;
        member.roles.add(role);
    }
    const newInvites = yield guild.invites.fetch();
    const oldInvites = __1.invites.get(guild.id);
    const invite = newInvites.find(i => { var _a, _b; return ((_a = i.uses) !== null && _a !== void 0 ? _a : 0) > ((_b = oldInvites === null || oldInvites === void 0 ? void 0 : oldInvites.get(i.code)) !== null && _b !== void 0 ? _b : 0); });
    __1.invites.set(guild.id, new discord_js_1.Collection(newInvites.map(i => [i.code, i.uses])));
    if (!invite)
        return;
    const guildRow = yield services_1.guildService.getGuildById(guild.id);
    const mappedRoleId = services_1.guildService.getInviteRoleForNormalizedCode(guildRow, invite.code);
    if (mappedRoleId) {
        const mappedRole = member.guild.roles.resolve(mappedRoleId);
        if (mappedRole) {
            yield member.roles.add(mappedRole).catch(() => { });
        }
    }
});
exports.onGuildMemberAdd = onGuildMemberAdd;
