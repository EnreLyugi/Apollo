import client from "../../client";

export const disconnectDiscordClient = async () => {
    /*if (client.isReady()) {
        await client.destroy();
    }*/

    client.user?.setPresence({ activities: [], status: 'invisible' });
}