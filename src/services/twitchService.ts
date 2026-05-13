import { EmbedBuilder, TextChannel } from 'discord.js';
import { Op } from 'sequelize';
import TwitchStreamer from '../models/twitchStreamer';
import guildService from './guildService';
import { getBotPresentGuildIds } from '../utils/botGuildContext';

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

/** One Twitch EventSub per broadcaster; reuse sub id from rows in guilds where this bot is present. */
async function ensureEventSubForBroadcaster(
    twitchUserId: string,
    activeGuildIds: Set<string> | null
): Promise<string | null> {
    if (activeGuildIds && activeGuildIds.size > 0) {
        const rowWithSub = await TwitchStreamer.findOne({
            where: {
                twitch_user_id: twitchUserId,
                guild_id: { [Op.in]: [...activeGuildIds] },
                subscription_id: { [Op.ne]: null },
            },
            order: [['id', 'ASC']],
        });
        if (rowWithSub?.subscription_id) {
            return rowWithSub.subscription_id;
        }
    } else {
        const rowWithSub = await TwitchStreamer.findOne({
            where: { twitch_user_id: twitchUserId, subscription_id: { [Op.ne]: null } },
            order: [['id', 'ASC']],
        });
        if (rowWithSub?.subscription_id) {
            return rowWithSub.subscription_id;
        }
    }
    return await createEventSubSubscription(twitchUserId);
}

const EMBED_DESCRIPTION_MAX = 4096;

function normalizeCustomDescription(text: string | null | undefined): string | null {
    if (text === null || text === undefined) return null;
    const trimmed = text.trim();
    if (trimmed.length === 0) return null;
    return trimmed.slice(0, EMBED_DESCRIPTION_MAX);
}

export async function addStreamer(
    guildId: string,
    username: string,
    customText?: string | null
): Promise<TwitchStreamer | null> {
    const user = await getUserByUsername(username);
    if (!user) return null;

    const normalized =
        customText === null || customText === undefined
            ? undefined
            : normalizeCustomDescription(customText);

    const existing = await TwitchStreamer.findOne({
        where: { guild_id: guildId, twitch_user_id: user.id },
    });
    if (existing) {
        if (normalized !== undefined) {
            existing.custom_description = normalized;
            await existing.save();
        }
        return existing;
    }

    const activeGuildIds = await getBotPresentGuildIds();
    const subscriptionId = await ensureEventSubForBroadcaster(user.id, activeGuildIds);
    const created = await TwitchStreamer.create({
        guild_id: guildId,
        twitch_username: user.login,
        twitch_user_id: user.id,
        subscription_id: subscriptionId,
        custom_description: normalized === undefined ? null : normalized,
    });

    if (subscriptionId) {
        if (activeGuildIds && activeGuildIds.size > 0) {
            await TwitchStreamer.update(
                { subscription_id: subscriptionId },
                {
                    where: {
                        twitch_user_id: user.id,
                        guild_id: { [Op.in]: [...activeGuildIds] },
                    },
                }
            );
            await TwitchStreamer.update(
                { subscription_id: null },
                {
                    where: {
                        twitch_user_id: user.id,
                        guild_id: { [Op.notIn]: [...activeGuildIds] },
                    },
                }
            );
        } else {
            await TwitchStreamer.update(
                { subscription_id: subscriptionId },
                { where: { twitch_user_id: user.id } }
            );
        }
    }

    return created;
}

export async function setTwitchStreamerDescription(
    guildId: string,
    username: string,
    customText: string | null
): Promise<TwitchStreamer | null> {
    const streamer = await TwitchStreamer.findOne({
        where: { guild_id: guildId, twitch_username: username.toLowerCase() },
    });
    if (!streamer) return null;
    streamer.custom_description =
        customText === null || customText === undefined
            ? null
            : normalizeCustomDescription(customText);
    await streamer.save();
    return streamer;
}

export async function removeStreamer(guildId: string, username: string): Promise<boolean> {
    const streamer = await TwitchStreamer.findOne({
        where: { guild_id: guildId, twitch_username: username.toLowerCase() },
    });
    if (!streamer) return false;

    const twitchUserId = streamer.twitch_user_id;
    const subscriptionId = streamer.subscription_id;

    await streamer.destroy();

    const activeGuildIds = await getBotPresentGuildIds();
    let remainingActive = 0;
    if (activeGuildIds && activeGuildIds.size > 0) {
        remainingActive = await TwitchStreamer.count({
            where: {
                twitch_user_id: twitchUserId,
                guild_id: { [Op.in]: [...activeGuildIds] },
            },
        });
    } else {
        remainingActive = await TwitchStreamer.count({ where: { twitch_user_id: twitchUserId } });
    }

    if (remainingActive === 0 && subscriptionId) {
        try {
            await deleteEventSubSubscription(subscriptionId);
        } catch (e) {
            console.error('Error deleting EventSub subscription:', e);
        }
        await TwitchStreamer.update({ subscription_id: null }, { where: { twitch_user_id: twitchUserId } });
    }

    return true;
}

export async function getStreamers(guildId: string): Promise<TwitchStreamer[]> {
    return await TwitchStreamer.findAll({ where: { guild_id: guildId } });
}

async function handleStreamOnline(event: any): Promise<void> {
    const { broadcaster_user_id, broadcaster_user_login, broadcaster_user_name } = event;

    const client = (await import('../client')).default;
    const streamers = (
        await TwitchStreamer.findAll({
            where: { twitch_user_id: broadcaster_user_id },
        })
    ).filter((s) => client.guilds.cache.has(s.guild_id));

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

            const customDesc = streamer.custom_description?.trim();
            if (customDesc) {
                embed.setDescription(customDesc.slice(0, EMBED_DESCRIPTION_MAX));
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
        const activeGuildIds = await getBotPresentGuildIds();
        if (!activeGuildIds) {
            console.warn('Twitch subscription sync skipped: Discord client is not ready yet.');
            return;
        }
        if (activeGuildIds.size === 0) {
            console.warn('Twitch subscription sync skipped: bot is not in any guild.');
            return;
        }

        const allStreamers = await TwitchStreamer.findAll();
        if (allStreamers.length === 0) return;

        const activeStreamers = allStreamers.filter((s) => activeGuildIds.has(s.guild_id));
        const activeBroadcasterIds = new Set(activeStreamers.map((s) => s.twitch_user_id));
        const allBroadcasterIds = new Set(allStreamers.map((s) => s.twitch_user_id));

        for (const bid of allBroadcasterIds) {
            if (activeBroadcasterIds.has(bid)) continue;
            const holder = allStreamers.find((s) => s.twitch_user_id === bid && s.subscription_id);
            if (holder?.subscription_id) {
                try {
                    await deleteEventSubSubscription(holder.subscription_id);
                } catch (e) {
                    console.error(`Error deleting orphan Twitch EventSub for broadcaster ${bid}:`, e);
                }
            }
            await TwitchStreamer.update({ subscription_id: null }, { where: { twitch_user_id: bid } });
        }

        const token = await getAppAccessToken();
        const res = await fetch(`${TWITCH_API_BASE}/eventsub/subscriptions`, {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID!,
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await res.json() as {
            data: { id: string; status: string; type: string; condition: { broadcaster_user_id: string } }[];
        };

        const activeSubByBroadcaster = new Map<string, string>();
        for (const s of data.data || []) {
            if (s.status !== 'enabled' || s.type !== 'stream.online') continue;
            const broadcasterId = s.condition?.broadcaster_user_id;
            if (!broadcasterId || activeSubByBroadcaster.has(broadcasterId)) continue;
            activeSubByBroadcaster.set(broadcasterId, s.id);
        }

        const uniqueBroadcasterIds = [...activeBroadcasterIds];

        for (const twitchUserId of uniqueBroadcasterIds) {
            let subId = activeSubByBroadcaster.get(twitchUserId) || null;
            if (!subId) {
                subId = await createEventSubSubscription(twitchUserId);
                const sample = activeStreamers.find((s) => s.twitch_user_id === twitchUserId);
                if (subId) {
                    console.log(
                        `Twitch EventSub created for broadcaster ${sample?.twitch_username ?? twitchUserId}`
                    );
                } else {
                    console.warn(
                        `Twitch EventSub create failed for broadcaster ${sample?.twitch_username ?? twitchUserId}`
                    );
                }
            }

            if (subId) {
                await TwitchStreamer.update(
                    { subscription_id: subId },
                    {
                        where: {
                            twitch_user_id: twitchUserId,
                            guild_id: { [Op.in]: [...activeGuildIds] },
                        },
                    }
                );
                await TwitchStreamer.update(
                    { subscription_id: null },
                    {
                        where: {
                            twitch_user_id: twitchUserId,
                            guild_id: { [Op.notIn]: [...activeGuildIds] },
                        },
                    }
                );
            }
        }

        console.log(
            `\x1b[32m%s\x1b[0m`,
            `Twitch subscriptions synced (${activeStreamers.length} active guild rows, ${uniqueBroadcasterIds.length} broadcasters; ${allStreamers.length} total DB rows)`
        );
    } catch (err) {
        console.error('Error syncing Twitch subscriptions:', err);
    }
}

export function initTwitchWebhookHandler(): void {
    const { setStreamOnlineHandler } = require('../server');
    setStreamOnlineHandler(handleStreamOnline);
}
