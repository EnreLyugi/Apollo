import { sockets } from "../../socket";

export const onPlayerSkip = async (queue: any, track: any) => {
    const data = queue.metadata;
    const { channelId, locale } = data;
    const ws = sockets.get(data.wsId);
    if(!ws) return;
    
    const message = {
      event: 'player_error',
      guildId: queue.guild.id,
      channelId: data.channelId
    };

    ws.send(JSON.stringify(message));

    /*const guild = queue.guild;

    const channel = guild.channels.resolve(channelId);
    if(!channel) return;
    if(!channel.isTextBased()) return;
  
    let response = new Embed()
      .setColor(`#FF0000`)
      .setAuthor({ name: t('misc.error_ocurred', locale) })
      .setDescription(error);
      
    console.error(error);
    //await channel.send({ embeds: [ response.build() ] });*/
}