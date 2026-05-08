import { APIMessageComponentEmoji } from 'discord.js';

const UNICODE_EMOJI_REGEX = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*/u;
const CUSTOM_EMOJI_REGEX = /^<(a?):(\w+):(\d+)>\s*/;

export function parseEmoji(text: string): { emoji: APIMessageComponentEmoji | null; label: string } {
    const customMatch = text.match(CUSTOM_EMOJI_REGEX);
    if (customMatch) {
        return {
            emoji: { id: customMatch[3], name: customMatch[2], animated: customMatch[1] === 'a' },
            label: text.slice(customMatch[0].length) || text,
        };
    }

    const unicodeMatch = text.match(UNICODE_EMOJI_REGEX);
    if (unicodeMatch) {
        return {
            emoji: { name: unicodeMatch[1] },
            label: text.slice(unicodeMatch[0].length) || text,
        };
    }

    return { emoji: null, label: text };
}
