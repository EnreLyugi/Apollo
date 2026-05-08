import { EmbedBuilder, TextChannel } from 'discord.js';
import YouTubeChannel from '../models/youtubeChannel';
import guildService from './guildService';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const PUBSUBHUBBUB_HUB = 'https://pubsubhubbub.appspot.com/subscribe';
const YOUTUBE_TOPIC_BASE = 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=';

const notifiedVideos = new Set<string>();
const MAX_CACHE_SIZE = 500;

export async function getChannelByUsername(query: string): Promise<{ id: string; title: string; thumbnail: string } | null> {
    const apiKey = process.env.YOUTUBE_API_KEY!;

    let res = await fetch(`${YOUTUBE_API_BASE}/channels?part=snippet&id=${encodeURIComponent(query)}&key=${apiKey}`);
    let data = await res.json() as any;

    if (data.items?.length > 0) {
        const ch = data.items[0];
        return { id: ch.id, title: ch.snippet.title, thumbnail: ch.snippet.thumbnails?.default?.url };
    }

    res = await fetch(`${YOUTUBE_API_BASE}/channels?part=snippet&forHandle=${encodeURIComponent(query.replace('@', ''))}&key=${apiKey}`);
    data = await res.json() as any;

    if (data.items?.length > 0) {
        const ch = data.items[0];
        return { id: ch.id, title: ch.snippet.title, thumbnail: ch.snippet.thumbnails?.default?.url };
    }

    res = await fetch(`${YOUTUBE_API_BASE}/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=1&key=${apiKey}`);
    data = await res.json() as any;

    if (data.items?.length > 0) {
        const ch = data.items[0];
        return { id: ch.snippet.channelId, title: ch.snippet.channelTitle, thumbnail: ch.snippet.thumbnails?.default?.url };
    }

    return null;
}

export async function getVideoDetails(videoId: string): Promise<any | null> {
    const apiKey = process.env.YOUTUBE_API_KEY!;
    const res = await fetch(`${YOUTUBE_API_BASE}/videos?part=snippet,liveStreamingDetails&id=${videoId}&key=${apiKey}`);
    const data = await res.json() as any;
    return data.items?.[0] || null;
}

export async function subscribeToPush(youtubeChannelId: string): Promise<boolean> {
    const callbackUrl = `${process.env.BASE_URL}/webhooks/youtube`;
    const topicUrl = `${YOUTUBE_TOPIC_BASE}${youtubeChannelId}`;

    const params = new URLSearchParams({
        'hub.callback': callbackUrl,
        'hub.topic': topicUrl,
        'hub.verify': 'async',
        'hub.mode': 'subscribe',
        'hub.lease_seconds': '864000',
    });

    const res = await fetch(PUBSUBHUBBUB_HUB, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    return res.status === 202 || res.status === 204;
}

export async function unsubscribeFromPush(youtubeChannelId: string): Promise<boolean> {
    const callbackUrl = `${process.env.BASE_URL}/webhooks/youtube`;
    const topicUrl = `${YOUTUBE_TOPIC_BASE}${youtubeChannelId}`;

    const params = new URLSearchParams({
        'hub.callback': callbackUrl,
        'hub.topic': topicUrl,
        'hub.verify': 'async',
        'hub.mode': 'unsubscribe',
    });

    const res = await fetch(PUBSUBHUBBUB_HUB, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    return res.status === 202 || res.status === 204;
}

export async function addChannel(guildId: string, query: string): Promise<YouTubeChannel | null> {
    const channel = await getChannelByUsername(query);
    if (!channel) return null;

    const existing = await YouTubeChannel.findOne({
        where: { guild_id: guildId, youtube_channel_id: channel.id },
    });
    if (existing) return existing;

    await subscribeToPush(channel.id);

    return await YouTubeChannel.create({
        guild_id: guildId,
        youtube_channel_id: channel.id,
        channel_name: channel.title,
    });
}

export async function removeChannel(guildId: string, channelName: string): Promise<boolean> {
    const entry = await YouTubeChannel.findOne({
        where: { guild_id: guildId, channel_name: channelName },
    });
    if (!entry) {
        const byId = await YouTubeChannel.findOne({
            where: { guild_id: guildId, youtube_channel_id: channelName },
        });
        if (!byId) return false;
        await unsubscribeFromPush(byId.youtube_channel_id);
        await byId.destroy();
        return true;
    }

    await unsubscribeFromPush(entry.youtube_channel_id);
    await entry.destroy();
    return true;
}

export async function getChannels(guildId: string): Promise<YouTubeChannel[]> {
    return await YouTubeChannel.findAll({ where: { guild_id: guildId } });
}

export async function handleNewVideo(youtubeChannelId: string, videoId: string): Promise<void> {
    const cacheKey = `${youtubeChannelId}:${videoId}`;
    if (notifiedVideos.has(cacheKey)) return;

    notifiedVideos.add(cacheKey);
    if (notifiedVideos.size > MAX_CACHE_SIZE) {
        const first = notifiedVideos.values().next().value;
        if (first) notifiedVideos.delete(first);
    }

    const entries = await YouTubeChannel.findAll({
        where: { youtube_channel_id: youtubeChannelId },
    });

    if (entries.length === 0) return;

    const video = await getVideoDetails(videoId);
    if (!video) return;

    const snippet = video.snippet;
    const publishedAt = new Date(snippet.publishedAt).getTime();
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    if (publishedAt < fifteenMinutesAgo) return;

    const isLive = snippet.liveBroadcastContent === 'live' || video.liveStreamingDetails;
    const client = (await import('../client')).default;

    for (const entry of entries) {
        try {
            const guildData = await guildService.getGuildById(entry.guild_id);
            if (!guildData?.youtube_channel) continue;

            const guild = client.guilds.cache.get(entry.guild_id);
            if (!guild) continue;

            const channel = guild.channels.cache.get(guildData.youtube_channel) as TextChannel | undefined;
            if (!channel) continue;

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setAuthor({
                    name: snippet.channelTitle,
                    url: `https://www.youtube.com/channel/${youtubeChannelId}`,
                })
                .setTitle(snippet.title)
                .setURL(`https://www.youtube.com/watch?v=${videoId}`)
                .setTimestamp(new Date(snippet.publishedAt));

            if (isLive) {
                embed.setDescription('🔴 Ao vivo agora!');
            }

            if (snippet.thumbnails?.maxres?.url) {
                embed.setImage(snippet.thumbnails.maxres.url);
            } else if (snippet.thumbnails?.high?.url) {
                embed.setImage(snippet.thumbnails.high.url);
            }

            const content = guildData.youtube_role ? `<@&${guildData.youtube_role}>` : undefined;
            await channel.send({ content, embeds: [embed] });
        } catch (err) {
            console.error(`Error sending YouTube notification to guild ${entry.guild_id}:`, err);
        }
    }
}

export async function syncYouTubeSubscriptions(): Promise<void> {
    try {
        const allChannels = await YouTubeChannel.findAll();
        const uniqueChannelIds = [...new Set(allChannels.map(c => c.youtube_channel_id))];

        for (const channelId of uniqueChannelIds) {
            await subscribeToPush(channelId);
        }

        if (uniqueChannelIds.length > 0) {
            console.log(`\x1b[32m%s\x1b[0m`, `YouTube subscriptions renewed (${uniqueChannelIds.length} channels)`);
        }
    } catch (err) {
        console.error('Error syncing YouTube subscriptions:', err);
    }
}
