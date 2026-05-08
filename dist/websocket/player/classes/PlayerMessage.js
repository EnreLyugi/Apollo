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
exports.PlayerMessage = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const localization_1 = require("../../../utils/localization");
const config_1 = require("../../../config");
const buttons_1 = require("../components/buttons");
const STATE_COLORS = {
    playing: 0x00FF00,
    paused: 0xFF0000,
    finished: 0xFF0000,
};
const STATE_LABEL_KEY = {
    playing: 'player.states.playing_now',
    paused: 'player.states.song_paused',
    finished: 'player.states.song_finished',
};
const V2_FLAGS = discord_js_1.MessageFlags.IsComponentsV2;
/** Evita `User#toString()` (`<@id>`), que em Components V2 notifica o utilizador. */
function formatRequestedByLabel(track) {
    const rb = track.requestedBy;
    if (rb == null)
        return '?';
    if (typeof rb === 'string') {
        const m = rb.trim().match(/^<@!?(\d+)>$/);
        if (m)
            return `\`${m[1]}\``;
        return rb;
    }
    if (typeof rb === 'object') {
        const u = rb;
        const name = u.globalName || u.displayName || u.username;
        if (name)
            return name;
    }
    return '?';
}
class PlayerMessage {
    constructor(track, locale) {
        this.state = 'playing';
        this.message = null;
        this.updateInterval = null;
        this.title = track.title;
        this.url = track.url;
        this.thumbnail = track.thumbnail;
        this.duration = track.duration;
        this.requestedBy = formatRequestedByLabel(track);
        this.locale = locale;
    }
    buildContainer() {
        const stateLabel = (0, localization_1.t)(STATE_LABEL_KEY[this.state], this.locale);
        const reqLabel = (0, localization_1.t)('player.misc.requested_by', this.locale);
        let trackInfo = `[${this.title}](${this.url})`;
        if (this.progressBar) {
            trackInfo += `\n${this.progressBar}`;
        }
        else if (this.duration) {
            trackInfo += `\n${(0, localization_1.t)('misc.duration', this.locale)} \`${this.duration}\``;
        }
        trackInfo += `\n\n${reqLabel}: ${this.requestedBy}`;
        const container = new discord_js_1.ContainerBuilder()
            .setAccentColor(STATE_COLORS[this.state]);
        container.addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(`### ${stateLabel}`));
        if (this.thumbnail) {
            const section = new builders_1.SectionBuilder()
                .addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(trackInfo))
                .setThumbnailAccessory(new builders_1.ThumbnailBuilder().setURL(this.thumbnail));
            container.addSectionComponents(section);
        }
        else {
            container.addTextDisplayComponents(new discord_js_1.TextDisplayBuilder().setContent(trackInfo));
        }
        if (this.state !== 'finished') {
            container.addSeparatorComponents(new discord_js_1.SeparatorBuilder().setSpacing(discord_js_1.SeparatorSpacingSize.Small));
            const buttons = this.state === 'paused' ? buttons_1.pausedButtons : buttons_1.unpausedButtons;
            container.addActionRowComponents(buttons);
        }
        return container;
    }
    send(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.buildContainer();
            this.message = yield channel.send({
                components: [container],
                flags: V2_FLAGS,
            });
            return this.message;
        });
    }
    setState(state_1, queue_1) {
        return __awaiter(this, arguments, void 0, function* (state, queue, skipEdit = false) {
            var _a;
            this.state = state;
            if (state === 'finished') {
                this.stopAutoUpdate();
                this.progressBar = undefined;
            }
            else if (queue) {
                this.progressBar = (_a = queue.node.createProgressBar({ length: config_1.progressBarOptions.size })) !== null && _a !== void 0 ? _a : undefined;
            }
            if (!skipEdit)
                yield this.edit();
        });
    }
    updateProgress(queue) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.state = queue.node.isPaused() ? 'paused' : 'playing';
            this.progressBar = (_a = queue.node.createProgressBar({ length: config_1.progressBarOptions.size })) !== null && _a !== void 0 ? _a : undefined;
            yield this.edit();
        });
    }
    edit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.message)
                return;
            const container = this.buildContainer();
            const msg = yield this.message.edit({
                components: [container],
                flags: V2_FLAGS,
            }).catch(() => null);
            if (msg)
                this.message = msg;
        });
    }
    getInteractionPayload() {
        const container = this.buildContainer();
        return { components: [container] };
    }
    startAutoUpdate(queue, trackUrl) {
        this.stopAutoUpdate();
        this.updateInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (((_a = queue.currentTrack) === null || _a === void 0 ? void 0 : _a.url) !== trackUrl || (!queue.node.isPlaying() && !queue.node.isPaused())) {
                    yield this.setState('finished');
                    return;
                }
                yield this.updateProgress(queue);
            }
            catch (_b) {
                yield this.setState('finished');
            }
        }), 2000);
    }
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}
exports.PlayerMessage = PlayerMessage;
