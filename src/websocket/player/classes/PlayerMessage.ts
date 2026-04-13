import {
    ActionRowBuilder,
    ButtonBuilder,
    ContainerBuilder,
    Message,
    MessageFlags,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextChannel,
    TextDisplayBuilder,
} from "discord.js";
import { SectionBuilder, ThumbnailBuilder } from "@discordjs/builders";
import { t, mapLocale, type Locales } from "../../../utils/localization";
import { progressBarOptions } from "../../../config";
import { pausedButtons, unpausedButtons } from "../components/buttons";

export type PlayerState = 'playing' | 'paused' | 'finished';

const STATE_COLORS: Record<PlayerState, number> = {
    playing:  0x00FF00,
    paused:   0xFF0000,
    finished: 0xFF0000,
};

const STATE_LABEL_KEY: Record<PlayerState, string> = {
    playing:  'player.states.playing_now',
    paused:   'player.states.song_paused',
    finished: 'player.states.song_finished',
};

const V2_FLAGS = MessageFlags.IsComponentsV2;

/** Evita `User#toString()` (`<@id>`), que em Components V2 notifica o utilizador. */
function formatRequestedByLabel(track: { requestedBy?: unknown }): string {
    const rb = track.requestedBy;
    if (rb == null) return '?';
    if (typeof rb === 'string') {
        const m = rb.trim().match(/^<@!?(\d+)>$/);
        if (m) return `\`${m[1]}\``;
        return rb;
    }
    if (typeof rb === 'object') {
        const u = rb as {
            globalName?: string | null;
            username?: string;
            displayName?: string;
        };
        const name = u.globalName || u.displayName || u.username;
        if (name) return name;
    }
    return '?';
}

export class PlayerMessage {
    public state: PlayerState = 'playing';
    public message: Message | null = null;

    private title: string;
    private url: string;
    private thumbnail?: string;
    private duration?: string;
    private requestedBy: string;
    private locale: Locales | undefined;
    private progressBar?: string;
    private updateInterval: NodeJS.Timeout | null = null;

    constructor(track: any, locale: Locales | undefined) {
        this.title = track.title;
        this.url = track.url;
        this.thumbnail = track.thumbnail;
        this.duration = track.duration;
        this.requestedBy = formatRequestedByLabel(track);
        this.locale = locale;
    }

    private buildContainer(): ContainerBuilder {
        const stateLabel = t(STATE_LABEL_KEY[this.state], this.locale);
        const reqLabel = t('player.misc.requested_by', this.locale);

        let trackInfo = `[${this.title}](${this.url})`;
        if (this.progressBar) {
            trackInfo += `\n${this.progressBar}`;
        } else if (this.duration) {
            trackInfo += `\n${t('misc.duration', this.locale)} \`${this.duration}\``;
        }
        trackInfo += `\n\n${reqLabel}: ${this.requestedBy}`;

        const container = new ContainerBuilder()
            .setAccentColor(STATE_COLORS[this.state]);

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`### ${stateLabel}`)
        );

        if (this.thumbnail) {
            const section = new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(trackInfo)
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder().setURL(this.thumbnail)
                );
            container.addSectionComponents(section);
        } else {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(trackInfo)
            );
        }

        if (this.state !== 'finished') {
            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
            );
            const buttons = this.state === 'paused' ? pausedButtons : unpausedButtons;
            container.addActionRowComponents(buttons as ActionRowBuilder<ButtonBuilder>);
        }

        return container;
    }

    async send(channel: TextChannel | any): Promise<Message | null> {
        const container = this.buildContainer();
        this.message = await channel.send({
            components: [container],
            flags: V2_FLAGS,
        });
        return this.message;
    }

    async setState(state: PlayerState, queue?: any, skipEdit = false): Promise<void> {
        this.state = state;

        if (state === 'finished') {
            this.stopAutoUpdate();
            this.progressBar = undefined;
        } else if (queue) {
            this.progressBar = queue.node.createProgressBar({ length: progressBarOptions.size }) ?? undefined;
        }

        if (!skipEdit) await this.edit();
    }

    async updateProgress(queue: any): Promise<void> {
        this.state = queue.node.isPaused() ? 'paused' : 'playing';
        this.progressBar = queue.node.createProgressBar({ length: progressBarOptions.size }) ?? undefined;
        await this.edit();
    }

    private async edit(): Promise<void> {
        if (!this.message) return;
        const container = this.buildContainer();
        const msg = await this.message.edit({
            components: [container],
            flags: V2_FLAGS,
        }).catch(() => null);
        if (msg) this.message = msg;
    }

    getInteractionPayload() {
        const container = this.buildContainer();
        return { components: [container] as any };
    }

    startAutoUpdate(queue: any, trackUrl: string): void {
        this.stopAutoUpdate();

        this.updateInterval = setInterval(async () => {
            try {
                if (queue.currentTrack?.url !== trackUrl || (!queue.node.isPlaying() && !queue.node.isPaused())) {
                    await this.setState('finished');
                    return;
                }
                await this.updateProgress(queue);
            } catch {
                await this.setState('finished');
            }
        }, 2000);
    }

    stopAutoUpdate(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}
