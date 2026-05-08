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
exports.onInteractionCreate = void 0;
const player_1 = require("../../player");
const onInteractionCreate = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (interaction.isButton()) {
        const guild = interaction.guild;
        if (!guild)
            return;
        const player = (0, player_1.getPlayer)();
        const queue = player.nodes.get(guild.id);
        if (!queue)
            return interaction.message.delete().catch(() => { });
        if (!queue.currentTrack)
            return;
        const data = queue.metadata;
        const pm = data.playerMessage;
        if (interaction.message.id !== data.currentMessage.id)
            return interaction.message.delete().catch(() => { });
        if (((_a = guild.members.me) === null || _a === void 0 ? void 0 : _a.voice.channel) !== ((_b = guild.members.resolve(interaction.user.id)) === null || _b === void 0 ? void 0 : _b.voice.channel))
            return;
        switch (interaction.customId) {
            case 'rewindButton':
                queue.node.seek(100);
                yield pm.setState('playing', queue, true);
                yield interaction.update(pm.getInteractionPayload());
                break;
            case 'pauseButton':
                queue.node.pause();
                yield pm.setState('paused', queue, true);
                yield interaction.update(pm.getInteractionPayload());
                break;
            case 'unpauseButton':
                queue.node.resume();
                yield pm.setState('playing', queue, true);
                yield interaction.update(pm.getInteractionPayload());
                break;
            case 'skipButton':
                yield interaction.deferUpdate();
                queue.node.skip();
                break;
            default:
                return;
        }
    }
});
exports.onInteractionCreate = onInteractionCreate;
