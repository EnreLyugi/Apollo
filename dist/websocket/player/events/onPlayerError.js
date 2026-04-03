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
exports.onPlayerError = void 0;
const socket_1 = require("../../socket");
const onPlayerError = (queue, error) => __awaiter(void 0, void 0, void 0, function* () {
    const data = queue.metadata;
    const { channelId, locale } = data;
    const ws = socket_1.sockets.get(data.wsId);
    if (!ws)
        return;
    const message = {
        event: 'player_error',
        guildId: queue.guild.id,
        channelId: data.channelId
    };
    ws.send(JSON.stringify(message));
    console.error(error);
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
});
exports.onPlayerError = onPlayerError;
