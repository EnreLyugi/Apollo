import { Queue } from "@enrelyugi/discord-music-player";
import { QueueData } from "./types";
import { mapLocale, t } from "../../../utils/localization";
import Embed from "../../../models/embed";
import { colors } from "../../../config";
import { sockets } from "../../socket";

export const onQueueEnd = async (queue: Queue) => {
    const data = queue.data as QueueData;
    const { channelId, locale } = data;
    const ws = sockets.get(data.wsId);
    if(!ws) return;
    
    const message = {
      event: 'queue_ended',
      guildId: queue.guild.id,
      channelId: data.channelId
    };

    ws.send(JSON.stringify(message));

    const guild = queue.guild;

    const channel = guild.channels.resolve(channelId);
    if(!channel) return;
    if(!channel.isTextBased()) return;
  
    let response = new Embed()
      .setColor(`#${colors.default_color}`)
      .setAuthor({ name: t('player.events.queue_ended.title', locale) })
      .setDescription(t('player.events.queue_ended.description', locale));
    await channel.send({ embeds: [ response.build() ] });
}