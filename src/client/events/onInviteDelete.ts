import { Invite } from "discord.js";
import { invites } from "../";

export const onInviteDelete = async (invite: Invite) => {
  if (!invite.guild) return;
  invites.get(invite.guild.id)?.delete(invite.code);
};