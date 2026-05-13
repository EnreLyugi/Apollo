import express from 'express';
import crypto from 'crypto';

const app = express();

app.use('/webhooks/twitch', express.raw({ type: 'application/json' }));
app.use('/webhooks/youtube', express.raw({ type: 'application/atom+xml' }));
app.use(express.json());

const TWITCH_MESSAGE_ID = 'twitch-eventsub-message-id';
const TWITCH_MESSAGE_TIMESTAMP = 'twitch-eventsub-message-timestamp';
const TWITCH_MESSAGE_SIGNATURE = 'twitch-eventsub-message-signature';
const TWITCH_MESSAGE_TYPE = 'twitch-eventsub-message-type';

function verifyTwitchSignature(req: express.Request): boolean {
    const secret = process.env.TWITCH_EVENTSUB_SECRET!;
    const messageId = req.headers[TWITCH_MESSAGE_ID] as string;
    const timestamp = req.headers[TWITCH_MESSAGE_TIMESTAMP] as string;
    const body = req.body as Buffer;

    if (!messageId || !timestamp || !body) return false;

    const message = messageId + timestamp + body.toString();
    const expectedSignature = 'sha256=' + crypto.createHmac('sha256', secret).update(message).digest('hex');
    const actualSignature = req.headers[TWITCH_MESSAGE_SIGNATURE] as string;

    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(actualSignature)
    );
}

let streamOnlineHandler: ((event: any) => Promise<void>) | null = null;

export function setStreamOnlineHandler(handler: (event: any) => Promise<void>) {
    streamOnlineHandler = handler;
}

app.post('/webhooks/twitch', async (req, res) => {
    if (!verifyTwitchSignature(req)) {
        return res.status(403).send('Invalid signature');
    }

    const messageType = req.headers[TWITCH_MESSAGE_TYPE] as string;
    const payload = JSON.parse((req.body as Buffer).toString());

    if (messageType === 'webhook_callback_verification') {
        return res.status(200).type('text/plain').send(payload.challenge);
    }

    if (messageType === 'notification') {
        const eventType = payload.subscription?.type;

        if (eventType === 'stream.online' && streamOnlineHandler) {
            streamOnlineHandler(payload.event).catch(err =>
                console.error('Error handling stream.online:', err)
            );
        }

        return res.status(204).send();
    }

    if (messageType === 'revocation') {
        console.log(`Twitch subscription revoked: ${payload.subscription?.id} (${payload.subscription?.status})`);
        return res.status(204).send();
    }

    res.status(204).send();
});

// YouTube PubSubHubbub verification
app.get('/webhooks/youtube', (req, res) => {
    const challenge = req.query['hub.challenge'] as string;
    if (challenge) {
        return res.status(200).type('text/plain').send(challenge);
    }
    res.status(400).send('Missing challenge');
});

// YouTube PubSubHubbub notification
app.post('/webhooks/youtube', async (req, res) => {
    res.status(204).send();

    try {
        const xml = (req.body as Buffer).toString();
        const videoIdMatch = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        const channelIdMatch = xml.match(/<yt:channelId>([^<]+)<\/yt:channelId>/);

        if (videoIdMatch && channelIdMatch) {
            const { handleNewVideo } = require('./services/youtubeService');
            handleNewVideo(channelIdMatch[1], videoIdMatch[1]).catch((err: any) =>
                console.error('Error handling YouTube notification:', err)
            );
        }
    } catch (err) {
        console.error('Error parsing YouTube webhook:', err);
    }
});

export function startWebhookServer(): void {
    const { initTwitchWebhookHandler } = require('./services/twitchService');
    initTwitchWebhookHandler();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`\x1b[32m%s\x1b[0m`, `HTTP server listening on port ${port}`);
    });
}
