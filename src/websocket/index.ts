import { initializePlayer } from './player';

(async () => {
    await import('./client/'); //Constructs Discord Client
    await initializePlayer(); //Initialize Player Client
    await import('./socket/'); //Constructs Socket Client
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

