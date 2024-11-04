import { WelcomeSettings } from '../models';

class WelcomeSettingsService {
  public async fetch(guild_id: string): Promise<WelcomeSettings | null> {
    return await WelcomeSettings.findOne({ where: { guild_id } })
  }

  public async create(channel_id: string, guild_id: string, title: string, description: string, image: string): Promise<WelcomeSettings> {
    return await WelcomeSettings.create({ channel_id, guild_id, title, description, image })
  }

  public async saveSettings(channel_id: string, guild_id: string, title: string, description: string, image: string): Promise<WelcomeSettings> {
    var welcomeSettings = await this.fetch(guild_id);

    if(!welcomeSettings) {
      welcomeSettings = await this.create(channel_id, guild_id, title, description, image);
    }

    welcomeSettings.channel_id = channel_id;
    welcomeSettings.guild_id = guild_id;
    welcomeSettings.title = title;
    welcomeSettings.description = description;
    welcomeSettings.image = image;

    await welcomeSettings.save();

    return welcomeSettings;
  }
}

export default new WelcomeSettingsService();
