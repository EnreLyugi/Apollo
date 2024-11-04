import User from '../models/user';

class UserService {
  public async createUser(id: string, username: string): Promise<User> {
    return await User.create({ id, username });
  }

  public async getUserById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  public async createUserIfNotExists(id: string, username: string): Promise<User | null> {
    try {
      const user = await this.getUserById(id);
      if(!user) {
        return await this.createUser(id, username);
      }
      return user;
    } catch(e) {
      throw new Error('An Error Ocurred on creating a new user!');
    }
  }
}

export default new UserService();
