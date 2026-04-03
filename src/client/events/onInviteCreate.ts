import { Invite } from "discord.js";
import { invites } from "../";

export const onInviteCreate = async (invite: Invite) => {
  if (!invite.guild) return;
  invites.get(invite.guild.id)?.set(invite.code, invite.uses);
};