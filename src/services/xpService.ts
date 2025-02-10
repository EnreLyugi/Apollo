import xpChannelService from './xpChannelService';
import { Channel, Guild, GuildMember } from 'discord.js';
import { userService, memberService, guildService, xpRoleService } from './';
import Member from '../models/member';
import { Server } from 'http';


class xpService {
  private cooldownArray: string[] = [];

  private addCooldown(userId: string, guildId: string) {
    this.cooldownArray.push(`${userId}:${guildId}`);
  }

  private removeCooldown(userId: string, guildId: string) {
    this.cooldownArray.splice(this.cooldownArray.indexOf(`${userId}:${guildId}`), 1);
  }

  private hasCooldown(userId: string, guildId: string) {
    return this.cooldownArray.includes(`${userId}:${guildId}`);
  }

  private async handleRoles(guild: Guild, member: GuildMember, xp: number) {
    const xpRoles = await xpRoleService.getPreviousRoles(guild.id, xp);
    const unreachedRoles = await xpRoleService.getUnreachedRoles(guild.id, xp);

    if(xpRoles) {
      xpRoles.forEach((role, index) => {
        if(index == 0) {
          if(!member.roles.resolve(role.role_id)) {
            member.roles.add(role.role_id);
          }
        } else {
          if(member.roles.resolve(role.role_id)) {
            member.roles.remove(role.role_id)
          }
        }
      });
    }

    if(unreachedRoles) {
      unreachedRoles.forEach((role) => {
        if(member.roles.resolve(role.role_id)) {
          member.roles.remove(role.role_id)
        }
      })
    }
  }

  public async handleXP(channel: Channel, guild: Guild, member: GuildMember) {
    const user = member.user
    const userData = await userService.createUserIfNotExists(user.id, user.username);
    const memberData = await memberService.createMemberIfNotExists(user.id, guild.id);
    const guildData = await guildService.createGuildIfNotExists(guild.id);

    //console.log(`${member.displayName} tem dados?`);
    if(!userData || !guildData || !memberData) return;
    //console.log(`${member.displayName} tem`);

    const isXpDisabled = await xpChannelService.getChannel(channel.id, guild.id);
    if(isXpDisabled) {
      //console.log(`${member.displayName} xp desativado`);
      return;
    };

    if(this.hasCooldown(user.id, guild.id)) {
      //console.log(`${member.displayName} está em cooldown`);
      return;
    };

    const xp = Math.round(Math.random() * 9) + 1;
    console.log(`${xp}xp adicionado para ${member.displayName} em ${guild.name}`);
    [userData, memberData].forEach(async data => {
      data.xp += xp;
      await data.save();
    });

    memberData.coin++;
    await memberData.save();

    this.handleRoles(guild, member, memberData.xp)

    this.addCooldown(user.id, guild.id);
    setTimeout(() => this.removeCooldown(user.id, guild.id), 60000);
  }

  public async addXP(guild: Guild, member: GuildMember, amount: number): Promise<Member | undefined> {
    const memberData = await memberService.createMemberIfNotExists(member.id, guild.id);

    if(!memberData) return;

    memberData.xp += amount;
    await memberData.save();

    this.handleRoles(guild, member, memberData.xp);

    //console.log(`${amount}xp adicionado para ${member.displayName} em ${guild.name}`);

    return memberData
  }

  public async removeXP(guild: Guild, member: GuildMember, amount: number): Promise<Member | undefined> {
    const memberData = await memberService.createMemberIfNotExists(member.id, guild.id);

    if(!memberData) return;

    memberData.xp = Math.max(0, memberData.xp - amount);
    await memberData.save();

    this.handleRoles(guild, member, memberData.xp)

    return memberData
  }

  public async getTop5(guild: Guild): Promise<Member[] | null> {
    return await Member.findAll({
      where: {
        guild_id: guild.id
      },
      order: [['xp', 'DESC']],
      limit: 5
    });
  }
}

export default new xpService();
