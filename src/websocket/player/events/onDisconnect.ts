import { QueueData } from "./types";
import { t } from "../../../utils/localization";
import Embed from "../../../models/embed";
import { colors } from "../../../config";
import { sockets } from "../../socket";
import { GuildQueue } from "discord-player";

export const onDisconnect = async (queue: GuildQueue) => {
    const data = queue.metadata as QueueData;
    const { channelId, locale } = data;
    const ws = sockets.get(data.wsId);
    if(!ws) return;
    
    const message = {
      event: 'client_disconnected',
      guildId: queue.guild.id,
      channelId: data.channelId,
      playingChannel: data.channel.id
    };

    ws.send(JSON.stringify(message));

    const guild = queue.guild;

    const channel = guild.channels.resolve(channelId);
    if(!channel) return;
    if(!channel.isTextBased()) return;
  
    let response = new Embed()
      .setColor(`#${colors.default_color}`)
      .setAuthor({ name: t('player.events.client_disconnect.title', locale) })
      .setDescription(t('player.events.client_disconnect.description', locale));
    await channel.send({ embeds: [ response.build() ] });
}