import { Birthday } from '../models';

class BirthdayService {
  public async addBirthday(user_id: string, date: string): Promise<Birthday> {
    const currentBirthday = await Birthday.findOne({ where: { user_id } });

    if (currentBirthday) {
      currentBirthday.date = date;
      await currentBirthday.save();
      return currentBirthday;
    }

    return await Birthday.create({ user_id, date });
  }

  public async getBirthdays(): Promise<Birthday[] | null> {
    const date = new Date();
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const formattedDate = `${day}/${month}`;

    return await Birthday.findAll({
      where: {
        date: formattedDate
      }
    });
  }
}

export default new BirthdayService();
