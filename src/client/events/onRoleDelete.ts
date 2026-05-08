import { Guild, Role } from "discord.js";
import { xpRoleService, colorRoleService, userColorService, memberService, guildService } from "../../services";

async function refundAndRemoveColorRole(roleId: string, guildId: string, roleName: string) {
    const guildData = await guildService.getGuildById(guildId);
    const price = guildData?.color_roles_price ?? 0;

    if (price > 0) {
        const owners = await userColorService.getOwnersByRole(roleId);
        for (const owner of owners) {
            const member = await memberService.getMember(owner.user_id, owner.guild_id);
            if (member) {
                member.coin += price;
                await member.save();
                console.log(`[role-delete] devolvido ${price} moedas para ${owner.user_id}`);
            }
        }
    }

    await userColorService.removeByRole(roleId);
    await colorRoleService.removeRole(roleId);
    console.log(`[role-delete] colorRole removido: ${roleName}`);
}

export const onRoleDelete = async (role: Role) => {
    const xpRole = await xpRoleService.getRole(role.id, role.guild.id);
    if (xpRole) {
        await xpRoleService.removeRole(role.id);
        console.log(`[role-delete] xpRole removido: ${role.name}`);
    }

    const colorRole = await colorRoleService.getRole(role.id);
    if (colorRole) {
        await refundAndRemoveColorRole(role.id, role.guild.id, role.name);
    }
}

export const syncDeletedColorRoles = async (guild: Guild) => {
    await guild.roles.fetch();
    const dbRoles = await colorRoleService.getGuildRoles(guild.id);
    if (!dbRoles || dbRoles.length === 0) return;

    let removed = 0;
    for (const cr of dbRoles) {
        if (!guild.roles.resolve(cr.role_id)) {
            await refundAndRemoveColorRole(cr.role_id, guild.id, cr.name);
            removed++;
        }
    }
    if (removed > 0) {
        console.log(`[startup-sync] ${guild.name}: ${removed} cargo(s) de cor órfão(s) removido(s) com reembolso.`);
    }
}