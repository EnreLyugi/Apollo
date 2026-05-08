import { validateEnv } from './utils/validateEnv';
import { loadDatabase } from './utils/loadDatabase';
import { loadApplicationCommands } from './utils/loadApplicationCommands';
import { startWebhookServer } from './server';

console.log(`\x1b[32m%s\x1b[0m`, "Bot developed by: Enre Lyugi");

(async () => {
    validateEnv();
    await loadDatabase();
    startWebhookServer();
    await loadApplicationCommands();
    await import('./client/');
    const { ready } = await import('./websocket');
    await ready;
})();

process.on("SIGINT", ()  => {
    console.log(`\x1b[32m%s\x1b[0m`, "\nApplication shutdown with CTRL+C");
    process.exit(1);
});
  
process.on('uncaughtException', (err) => {
    console.error(`\x1b[32m%s\x1b[0m`, err);
});

process.on('unhandledRejection', (reason) => {
    console.error(`\x1b[32m%s\x1b[0m`, 'Rejected Promise:', reason);
});

