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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sockets = void 0;
const ws_1 = require("ws");
const wsEvents = __importStar(require("./events"));
const wsPort = process.env.WS_PORT ? Number(process.env.WS_PORT) : 0;
const wss = new ws_1.WebSocketServer({ port: wsPort });
const sockets = new Map();
exports.sockets = sockets;
wss.on('connection', (ws) => {
    const wsId = generateUniqueId();
    sockets.set(wsId, ws);
    ws.on('message', (message) => { wsEvents.onMessage(message, wsId); });
    ws.on('close', () => {
        sockets.delete(wsId);
    });
});
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
function generateUniqueId() {
    return `ws-${Math.random().toString(36).substr(2, 9)}`;
}
