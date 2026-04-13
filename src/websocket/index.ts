import { initializePlayer } from './player';

/**
 * Promise que resolve quando o cliente websocket, o player e o servidor WS terminaram de carregar.
 * O `src/index.ts` pode fazer `await ready` (o `require()` sozinho não esperava a IIFE assíncrona).
 */
export const ready = (async () => {
    await import('./client/');
    await initializePlayer();
    await import('./socket/');
})();

process.on('SIGINT', () => {
    console.log(`\x1b[32m%s\x1b[0m`, '\nApplication shutdown with CTRL+C');
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error(`\x1b[32m%s\x1b[0m`, err);
});

process.on('unhandledRejection', (reason) => {
    console.error(`\x1b[32m%s\x1b[0m`, 'Rejected Promise:', reason);
});
