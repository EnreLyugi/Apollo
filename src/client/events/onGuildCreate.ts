import { Collection, Guild } from "discord.js";
import { invites } from "../";

export const onGuildCreate = async (guild: Guild) => {
  guild.invites.fetch().then(guildInvites => {
    invites.set(guild.id, new Collection(guildInvites.map(invite => [invite.code, invite.uses])));
  });
};