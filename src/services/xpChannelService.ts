import XpChannel from '../models/xpChannel';

class xpChannelService {
  public async addChannel(channel_id: string, guild_id: string): Promise<XpChannel> {
    return await XpChannel.create({ channel_id, guild_id });
  }

  public async removeChannel(channel_id: string): Promise<number> {
    return await XpChannel.destroy({ where: { channel_id } })
  }

  public async getChannel(channel_id: string, guild_id: string): Promise<XpChannel | null> {
    return await XpChannel.findOne({ where: { channel_id, guild_id } })
  }
}

export default new xpChannelService();
