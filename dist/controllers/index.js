"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BirthdayController = exports.musicClusterController = void 0;
const birthdayController_1 = __importDefault(require("./birthdayController"));
exports.BirthdayController = birthdayController_1.default;
const musicClusterController_1 = require("./musicClusterController");
Object.defineProperty(exports, "musicClusterController", { enumerable: true, get: function () { return musicClusterController_1.musicClusterController; } });
