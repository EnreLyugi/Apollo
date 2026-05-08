"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeInviteCode = normalizeInviteCode;
/** Extrai e normaliza o código de convite (ex.: URL discord.gg/xxx ou código cru). */
function normalizeInviteCode(input) {
    const s = input.trim();
    const m = s.match(/(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|\.com\/invite)\/([a-zA-Z0-9-]+)/i);
    const code = m ? m[1] : s;
    return code.toLowerCase();
}
