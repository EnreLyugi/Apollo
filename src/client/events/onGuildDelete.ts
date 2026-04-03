import { Guild } from "discord.js";
import { invites } from "../";

export const onGuildDelete = async (guild: Guild) => {
  invites.delete(guild.id);
};