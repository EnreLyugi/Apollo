import { Ship } from '../models';
import { Op } from 'sequelize';

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

    const value = Math.floor(Math.random() * 101);
    return await Ship.create({ user1, user2, value });
  }
}

export default new ShipService();
