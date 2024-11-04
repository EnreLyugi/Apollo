import { validateEnv } from './utils/validateEnv';
import { loadDatabase } from './utils/loadDatabase';
import { loadApplicationCommands } from './utils/loadApplicationCommands';

console.log(`\x1b[32m%s\x1b[0m`, "Bot developed by: Enre Lyugi");

(async () => {
    validateEnv(); //Validate if the required Environment variables are set
    await loadDatabase(); //Connects to Database
    await loadApplicationCommands(); //Setup slash commands
    await import('./client/'); //Constructs Discord Client
    await require('./websocket'); //Starts the music player websocket
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

