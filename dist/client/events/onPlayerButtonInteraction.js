"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.onPlayerButtonInteraction = void 0;
/** Botões do painel do player (discord-player). Import dinâmico evita ciclo client ↔ player na inicialização. */
const onPlayerButtonInteraction = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!interaction.isButton())
        return;
    const guild = interaction.guild;
    if (!guild)
        return;
    let getPlayer;
    try {
        ({ getPlayer } = yield Promise.resolve().then(() => __importStar(require('../../websocket/player'))));
    }
    catch (_c) {
        return;
    }
    let player;
    try {
        player = getPlayer();
    }
    catch (_d) {
        return;
    }
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
});
exports.onPlayerButtonInteraction = onPlayerButtonInteraction;
