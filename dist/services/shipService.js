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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const canvas_1 = require("canvas");
const discord_js_1 = require("discord.js");
(0, canvas_1.registerFont)(require("@canvas-fonts/impact"), { family: "Impact" });
class ShipService {
    getShip(user1, user2) {
        return __awaiter(this, void 0, void 0, function* () {
            const ship = yield models_1.Ship.findOne({
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            user1,
                            user2
                        },
                        {
                            user1: user2,
                            user2: user1
                        }
                    ]
                }
            });
            if (ship)
                return ship;
            const value = Math.floor(Math.random() * 100);
            return yield models_1.Ship.create({ user1, user2, value });
        });
    }
    generateShipImage(avatar1, avatar2, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = (0, canvas_1.createCanvas)(512, 256);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = "#23272A";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const img1 = yield (0, canvas_1.loadImage)(avatar1);
            const img2 = yield (0, canvas_1.loadImage)(avatar2);
            ctx.save();
            ctx.beginPath();
            ctx.arc(128, 128, 100, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img1, 28, 28, 200, 200);
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.arc(384, 128, 100, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img2, 284, 28, 200, 200);
            ctx.restore();
            ctx.font = `40px "Impact"`;
            ctx.fillStyle = "#FF0000";
            ctx.textAlign = "center";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 4;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2 + 110;
            ctx.fillText(`${value}%`, centerX, centerY);
            const buffer = canvas.toBuffer("image/png");
            return new discord_js_1.AttachmentBuilder(buffer, { name: 'ship.png' });
        });
    }
}
exports.default = new ShipService();
