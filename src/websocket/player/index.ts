import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import client from "../client/"
import * as playerEvents from './events';

const player = new Player(client);
player.extractors.loadMulti(DefaultExtractors);

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
    .on('playerError', playerEvents.onPlayerError)

export default player;