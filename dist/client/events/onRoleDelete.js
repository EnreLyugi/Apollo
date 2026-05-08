"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDeletedColorRoles = exports.onRoleDelete = void 0;
const services_1 = require("../../services");
function refundAndRemoveColorRole(roleId, guildId, roleName) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const guildData = yield services_1.guildService.getGuildById(guildId);
        const price = (_a = guildData === null || guildData === void 0 ? void 0 : guildData.color_roles_price) !== null && _a !== void 0 ? _a : 0;
        if (price > 0) {
            const owners = yield services_1.userColorService.getOwnersByRole(roleId);
            for (const owner of owners) {
                const member = yield services_1.memberService.getMember(owner.user_id, owner.guild_id);
                if (member) {
                    member.coin += price;
                    yield member.save();
                    console.log(`[role-delete] devolvido ${price} moedas para ${owner.user_id}`);
                }
            }
        }
        yield services_1.userColorService.removeByRole(roleId);
        yield services_1.colorRoleService.removeRole(roleId);
        console.log(`[role-delete] colorRole removido: ${roleName}`);
    });
}
const onRoleDelete = (role) => __awaiter(void 0, void 0, void 0, function* () {
    const xpRole = yield services_1.xpRoleService.getRole(role.id, role.guild.id);
    if (xpRole) {
        yield services_1.xpRoleService.removeRole(role.id);
        console.log(`[role-delete] xpRole removido: ${role.name}`);
    }
    const colorRole = yield services_1.colorRoleService.getRole(role.id);
    if (colorRole) {
        yield refundAndRemoveColorRole(role.id, role.guild.id, role.name);
    }
});
exports.onRoleDelete = onRoleDelete;
const syncDeletedColorRoles = (guild) => __awaiter(void 0, void 0, void 0, function* () {
    yield guild.roles.fetch();
    const dbRoles = yield services_1.colorRoleService.getGuildRoles(guild.id);
    if (!dbRoles || dbRoles.length === 0)
        return;
    let removed = 0;
    for (const cr of dbRoles) {
        if (!guild.roles.resolve(cr.role_id)) {
            yield refundAndRemoveColorRole(cr.role_id, guild.id, cr.name);
            removed++;
        }
    }
    if (removed > 0) {
        console.log(`[startup-sync] ${guild.name}: ${removed} cargo(s) de cor órfão(s) removido(s) com reembolso.`);
    }
});
exports.syncDeletedColorRoles = syncDeletedColorRoles;
