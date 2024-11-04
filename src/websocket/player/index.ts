import { Player } from '@enrelyugi/discord-music-player';
import client from "../client/"
import * as playerEvents from './events';

const player = new Player(client, {
    leaveOnEmpty: true,
    leaveOnStop: true,
    leaveOnEnd: true
});

//Player Events
player
    .on("songAdd", playerEvents.onSongAdd) //Song is added to Queue
    .on("songFirst", playerEvents.onSongStart) //When Song starts
    .on("playlistAdd", playerEvents.onPlaylistAdd) //Playlist is added to Queue
    .on("queueEnd", playerEvents.onQueueEnd) //Queue ends
    .on("clientDisconnect", playerEvents.onClientDisconnect) //Client Disconnects
    .on("error", playerEvents.onPlayerError); //Client gets error
    /*.on("songChanged", onSongChanged) //Song Changed*/

export default player;