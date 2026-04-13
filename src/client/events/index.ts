import { onReady } from './onReady';
import { onInteractionCreate } from './onInteractionCreate';
import { onMessageCreate } from './onMessageCreate';
import { onVoiceStateUpdate } from './onVoiceStateUpdate';
import { onGuildMemberAdd } from './onGuildMemberAdd'
import { onRoleDelete, syncDeletedColorRoles } from './onRoleDelete';
import { onInviteCreate } from './onInviteCreate';
import { onInviteDelete } from './onInviteDelete';
import { onGuildCreate } from './onGuildCreate';
import { onGuildDelete } from './onGuildDelete';

export { onReady, onInteractionCreate, onMessageCreate, onVoiceStateUpdate, onGuildMemberAdd, onRoleDelete, syncDeletedColorRoles, onInviteCreate, onInviteDelete, onGuildCreate, onGuildDelete};