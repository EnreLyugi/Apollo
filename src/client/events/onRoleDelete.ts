import { Role } from "discord.js";
import { xpRoleService } from "../../services";

export const onRoleDelete = async (role: Role) => {
    const xpRole = await xpRoleService.getRole(role.id, role.guild.id);

    if(xpRole) {
        await xpRoleService.removeRole(role.id);
        console.log(`${role.name} deleted`);
    }
}