import { GuildMember } from "discord.js";
import { Embed } from "../../models";
import { colors } from "../../config";
import { banService, guildService, welcomeSettingsService } from "../../services";
import { format } from "../../utils/localization";

export const onGuildMemberAdd = async (member: GuildMember) => {
    if(member.user.bot) return;
    const guild = member.guild;
    const welcomeSettings = await welcomeSettingsService.fetch(guild.id);

    const hasBan = await banService.getBan(member.user.id, guild.id);

    if(hasBan) {
        return member.ban();
    }

    if(welcomeSettings) {
        const embed = new Embed()
            .setColor(`#${colors.default_color}`)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
            .setThumbnail({ url: member.displayAvatarURL() || 'https://i.imgur.com/qlJnaP7.png' })
            .setTitle(format(welcomeSettings.title, {
                username: member.displayName,
                servername: guild.name
            }))
            .setDescription(format(welcomeSettings.description, {
                username: member.displayName,
                servername: guild.name
            }))
            .setFooter({ text: `${member.id}`, iconURL: member.displayAvatarURL() || 'https://i.imgur.com/qlJnaP7.png' })
            .setTimestamp(new Date())
            .build();

        if(welcomeSettings.image && welcomeSettings.image !== '' && typeof welcomeSettings.image === 'string') {
            embed.setImage(welcomeSettings.image);
        }

        const welcomeChannel = guild.channels?.resolve(welcomeSettings.channel_id);
        if(!welcomeChannel || !welcomeChannel.isTextBased()) return;

        welcomeChannel.send({ content: `${member}`, embeds: [ embed ] });
    }

    const welcomeRole = await guildService.getRole('welcome_role', guild.id)

    if (welcomeRole !== null) {
        const role = member.guild.roles.resolve(welcomeRole.toString());
        if(!role) return;
        member.roles.add(role);
    }
}