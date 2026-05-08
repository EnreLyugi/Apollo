import { EmbedBuilder, TextChannel } from 'discord.js';
import TwitchStreamer from '../models/twitchStreamer';
import guildService from './guildService';

const TWITCH_API_BASE = 'https://api.twitch.tv/helix';
const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';

let appAccessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAppAccessToken(): Promise<string> {
    if (appAccessToken && Date.now() < tokenExpiresAt) {
        return appAccessToken;
    }

    const params = new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID!,
        client_secret: process.env.TWITCH_CLIENT_SECRET!,
        grant_type: 'client_credentials',
    });

    const res = await fetch(`${TWITCH_AUTH_URL}?${params}`, { method: 'POST' });
    const data = await res.json() as { access_token: string; expires_in: number };

    appAccessToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return appAccessToken;
}

async function twitchFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await getAppAccessToken();
    const res = await fetch(`${TWITCH_API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID!,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    return res.json();
}

export async function getUserByUsername(username: string): Promise<{ id: string; login: string; display_name: string; profile_image_url: string } | null> {
    const data = await twitchFetch(`/users?login=${encodeURIComponent(username)}`);
    return data.data?.[0] || null;
}

export async function getStreamByUserId(userId: string): Promise<any | null> {
    const data = await twitchFetch(`/streams?user_id=${userId}`);
    return data.data?.[0] || null;
}

export async function getGameById(gameId: string): Promise<{ name: string } | null> {
    if (!gameId) return null;
    const data = await twitchFetch(`/games?id=${gameId}`);
    return data.data?.[0] || null;
}

export async function createEventSubSubscription(twitchUserId: string): Promise<string | null> {
    const callbackUrl = `${process.env.BASE_URL}/webhooks/twitch`;

    const body = {
        type: 'stream.online',
        version: '1',
        condition: { broadcaster_user_id: twitchUserId },
        transport: {
            method: 'webhook',
            callback: callbackUrl,
            secret: process.env.TWITCH_EVENTSUB_SECRET!,
        },
    };

    const data = await twitchFetch('/eventsub/subscriptions', {
        method: 'POST',
        body: JSON.stringify(body),
    });

    return data.data?.[0]?.id || null;
}

export async function deleteEventSubSubscription(subscriptionId: string): Promise<void> {
    const token = await getAppAccessToken();
    await fetch(`${TWITCH_API_BASE}/eventsub/subscriptions?id=${subscriptionId}`, {
        method: 'DELETE',
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID!,
            'Authorization': `Bearer ${token}`,
        },
    });
}

export async function addStreamer(guildId: string, username: string): Promise<TwitchStreamer | null> {
    const user = await getUserByUsername(username);
    if (!user) return null;

    const existing = await TwitchStreamer.findOne({
        where: { guild_id: guildId, twitch_user_id: user.id },
    });
    if (existing) return existing;

    const subscriptionId = await createEventSubSubscription(user.id);

    return await TwitchStreamer.create({
        guild_id: guildId,
        twitch_username: user.login,
        twitch_user_id: user.id,
        subscription_id: subscriptionId,
    });
}

export async function removeStreamer(guildId: string, username: string): Promise<boolean> {
    const streamer = await TwitchStreamer.findOne({
        where: { guild_id: guildId, twitch_username: username.toLowerCase() },
    });
    if (!streamer) return false;

    if (streamer.subscription_id) {
        try {
            await deleteEventSubSubscription(streamer.subscription_id);
        } catch (e) {
            console.error('Error deleting EventSub subscription:', e);
        }
    }

    await streamer.destroy();
    return true;
}

export async function getStreamers(guildId: string): Promise<TwitchStreamer[]> {
    return await TwitchStreamer.findAll({ where: { guild_id: guildId } });
}

async function handleStreamOnline(event: any): Promise<void> {
    const { broadcaster_user_id, broadcaster_user_login, broadcaster_user_name } = event;

    const streamers = await TwitchStreamer.findAll({
        where: { twitch_user_id: broadcaster_user_id },
    });

    if (streamers.length === 0) return;

    const guildsWithChannel: typeof streamers = [];
    for (const streamer of streamers) {
        const guildData = await guildService.getGuildById(streamer.guild_id);
        if (guildData?.twitch_channel) guildsWithChannel.push(streamer);
    }

    if (guildsWithChannel.length === 0) return;

    const stream = await getStreamByUserId(broadcaster_user_id);
    const user = await getUserByUsername(broadcaster_user_login);
    const game = stream?.game_id ? await getGameById(stream.game_id) : null;

    const client = (await import('../client')).default;

    for (const streamer of guildsWithChannel) {
        try {
            const guildData = await guildService.getGuildById(streamer.guild_id);
            if (!guildData?.twitch_channel) continue;

            const guild = client.guilds.cache.get(streamer.guild_id);
            if (!guild) continue;

            const channel = guild.channels.cache.get(guildData.twitch_channel) as TextChannel | undefined;
            if (!channel) continue;

            const thumbnailUrl = stream?.thumbnail_url
                ?.replace('{width}', '440')
                ?.replace('{height}', '248')
                + `?t=${Date.now()}`;

            const embed = new EmbedBuilder()
                .setColor(0x9146FF)
                .setAuthor({
                    name: broadcaster_user_name,
                    iconURL: user?.profile_image_url,
                    url: `https://twitch.tv/${broadcaster_user_login}`,
                })
                .setTitle(stream?.title || `${broadcaster_user_name} está ao vivo!`)
                .setURL(`https://twitch.tv/${broadcaster_user_login}`)
                .setTimestamp();

            if (game) {
                embed.addFields({ name: 'Categoria', value: game.name, inline: true });
            }

            if (thumbnailUrl) {
                embed.setImage(thumbnailUrl);
            }

            if (user?.profile_image_url) {
                embed.setThumbnail(user.profile_image_url);
            }

            const content = guildData.twitch_role
                ? (guildData.twitch_role === streamer.guild_id ? '@everyone' : `<@&${guildData.twitch_role}>`)
                : undefined;
            await channel.send({ content, embeds: [embed] });
        } catch (err) {
            console.error(`Error sending Twitch notification to guild ${streamer.guild_id}:`, err);
        }
    }
}

export async function syncTwitchSubscriptions(): Promise<void> {
    try {
        const allStreamers = await TwitchStreamer.findAll();
        if (allStreamers.length === 0) return;

        const token = await getAppAccessToken();
        const res = await fetch(`${TWITCH_API_BASE}/eventsub/subscriptions`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await res.json() as { data: { id: string; status: string; condition: { broadcaster_user_id: string } }[] };
        const activeSubIds = new Set((data.data || []).filter(s => s.status === 'enabled').map(s => s.id));

        for (const streamer of allStreamers) {
            if (!streamer.subscription_id || !activeSubIds.has(streamer.subscription_id)) {
                const newSubId = await createEventSubSubscription(streamer.twitch_user_id);
                streamer.subscription_id = newSubId;
                await streamer.save();
                console.log(`Twitch subscription re-created for ${streamer.twitch_username}`);
            }
        }

        console.log(`\x1b[32m%s\x1b[0m`, `Twitch subscriptions synced (${allStreamers.length} streamers)`);
    } catch (err) {
        console.error('Error syncing Twitch subscriptions:', err);
    }
}

export function initTwitchWebhookHandler(): void {
    const { setStreamOnlineHandler } = require('../server');
    setStreamOnlineHandler(handleStreamOnline);
}
