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
const validateEnv_1 = require("./utils/validateEnv");
const loadDatabase_1 = require("./utils/loadDatabase");
const loadApplicationCommands_1 = require("./utils/loadApplicationCommands");
console.log(`\x1b[32m%s\x1b[0m`, "Bot developed by: Enre Lyugi");
(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, validateEnv_1.validateEnv)(); //Validate if the required Environment variables are set
    yield (0, loadDatabase_1.loadDatabase)(); //Connects to Database
    yield (0, loadApplicationCommands_1.loadApplicationCommands)(); //Setup slash commands
    yield Promise.resolve().then(() => __importStar(require('./client/'))); //Constructs Discord Client
    yield require('./websocket'); //Starts the music player websocket
}))();
process.on("SIGINT", () => {
    console.log(`\x1b[32m%s\x1b[0m`, "\nApplication shutdown with CTRL+C");
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    console.error(`\x1b[32m%s\x1b[0m`, err);
});
process.on('unhandledRejection', (reason) => {
    console.error(`\x1b[32m%s\x1b[0m`, 'Rejected Promise:', reason);
});
