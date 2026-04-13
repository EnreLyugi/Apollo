import { Message, VoiceChannel } from "discord.js";
import { Locales } from "../../../../utils/localization";
import { PlayerMessage } from "../../classes";

export interface QueueData {
    channel: VoiceChannel;
    requestedBy: string;
    wsId: string;
    interactionId: string;
    channelId: string;
    locale: Locales | undefined;
    currentMessage: Message;
    playerMessage: PlayerMessage;
    track: any;
    customData: any;
}