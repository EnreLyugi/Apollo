import { Message } from 'discord.js';
import { xpService } from '../../services/';

export const onMessageCreate = async (message: Message) => {
    const user = message.member?.user;
    const guild = message.guild;

    if(!guild || !user || user.bot) return;

    await xpService.handleXP(message.channel, guild, message.member);
};