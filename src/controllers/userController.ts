// src/controllers/userController.ts
import { Request, Response } from 'express';
import UserService from '../services/userService';

class UserController {
  public async createUser(req: Request, res: Response): Promise<void> {
    const { id, username } = req.body;
    try {
      const user = await UserService.createUser(id, username);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const user = await UserService.getUserById(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user' });
    }
  }
}

export default new UserController();
