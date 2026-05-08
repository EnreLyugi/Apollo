"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDatabase = void 0;
const database_1 = __importDefault(require("../config/database"));
require("../models");
const loadDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.authenticate()
        .then(() => {
        console.log(`\x1b[32m%s\x1b[0m`, `Connected to Database!`);
    })
        .catch((err) => {
        throw new Error(err);
    });
    //await sequelize.drop();
    //    console.log(`\x1b[32m%s\x1b[0m`, `Database cleared!`);
    yield database_1.default.sync({ alter: true })
        .then(() => {
        console.log(`\x1b[32m%s\x1b[0m`, `Tables Synchronized!`);
    })
        .catch((err) => {
        throw new Error(err);
    });
});
exports.loadDatabase = loadDatabase;
