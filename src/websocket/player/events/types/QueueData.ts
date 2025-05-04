import { Message, VoiceChannel } from "discord.js";
import { Locales } from "../../../../utils/localization";

export interface QueueData {
    channel: VoiceChannel;
    requestedBy: string;
    wsId: string;
    interactionId: string;
    channelId: string;
    locale: Locales | undefined;
    currentMessage: Message;
    track: any;
    customData: any;
}