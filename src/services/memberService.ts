import Member from '../models/member';

class MemberService {
  public async createMember(member_id: string, guild_id: string): Promise<Member> {
    return await Member.create({ member_id, guild_id });
  }

  public async getMember(member_id: string, guild_id: string): Promise<Member | null> {
    return await Member.findOne({ where: { member_id, guild_id } });
  }

  public async createMemberIfNotExists(member_id: string, guild_id: string): Promise<Member | null> {
    try {
      const member = await this.getMember(member_id, guild_id);
      if(!member) {
        return await this.createMember(member_id, guild_id);
      }
      return member;
    } catch(e) {
      console.error("Error in createMemberIfNotExists:", e);
      throw new Error('An Error Occurred on creating a new user!');
    }
  }

  /** Zera moedas de todos os membros registados neste servidor. */
  public async resetCoinsForGuild(guild_id: string): Promise<number> {
    const [affected] = await Member.update({ coin: 0 }, { where: { guild_id } });
    return affected;
  }
}

export default new MemberService();
