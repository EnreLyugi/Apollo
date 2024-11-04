import { Song } from "@enrelyugi/discord-music-player";
import { ChatInputCommandInteraction, Message } from "discord.js";
import { Locales } from "../../../../utils/localization";

export interface QueueData {
    wsId: string;
    interactionId: string;
    channelId: string;
    locale: Locales | undefined;
    currentMessage: Message;
    song: Song;
}