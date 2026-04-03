import { Ship } from '../models';
import { Op } from 'sequelize';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { AttachmentBuilder } from 'discord.js';

registerFont(require("@canvas-fonts/impact"), { family: "Impact" });

class ShipService {
  public async getShip(user1: string, user2: string): Promise<Ship> {
    const ship = await Ship.findOne({
      where: {
        [Op.or]: [
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

    if(ship) return ship;

    const value = Math.floor(Math.random() * 100);
    return await Ship.create({ user1, user2, value });
  }

  public async generateShipImage(avatar1: string, avatar2: string, value: number): Promise<AttachmentBuilder> {
    const canvas = createCanvas(512, 256);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#23272A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img1 = await loadImage(avatar1);
    const img2 = await loadImage(avatar2);

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
    return new AttachmentBuilder(buffer, { name: 'ship.png' });
  }
}

export default new ShipService();
