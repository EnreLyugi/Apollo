import type { Client } from "discord.js";

/** Resolves the logged-in Discord client (same module as slash commands). */
export async function getCachedDiscordClient(): Promise<Client | null> {
    try {
        const { default: client } = await import("../client");
        return client;
    } catch {
        return null;
    }
}

/**
 * Guild IDs where this process's bot is currently present.
 * `null` if the client is not ready yet (avoid destructive sync decisions).
 */
export async function getBotPresentGuildIds(): Promise<Set<string> | null> {
    const client = await getCachedDiscordClient();
    if (!client?.isReady()) return null;
    return new Set(client.guilds.cache.keys());
}
