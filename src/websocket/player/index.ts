import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import client from "../client/"
import * as playerEvents from './events';

let playerInstance: Player | null = null;

export const initializePlayer = async () => {
    if (playerInstance) {
        return playerInstance;
    }

    const player = new Player(client);
    await player.extractors.loadMulti(DefaultExtractors);

    //Player Events
    player.events
        .on('playerStart', playerEvents.onPlayerStart)
        .on('audioTrackAdd', playerEvents.onAudioTrackAdd)
        .on('audioTracksAdd', playerEvents.onAudioTracksAdd)
        .on('playerFinish', playerEvents.onPlayerFinish)
        .on('playerSkip', playerEvents.onPlayerSkip)
        .on('playerPause', playerEvents.onPlayerPause)
        .on('playerResume', playerEvents.onPlayerResume)
        .on('emptyQueue', playerEvents.onEmptyQueue)
        .on('error', playerEvents.onPlayerError)
        .on('disconnect', playerEvents.onDisconnect)
        .on('playerError', playerEvents.onPlayerError);

    playerInstance = player;
    return player;
};

export const getPlayer = () => {
    if (!playerInstance) {
        throw new Error('Player not initialized. Call initializePlayer() first.');
    }
    return playerInstance;
};