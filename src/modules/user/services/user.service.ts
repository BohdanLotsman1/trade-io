import { HttpException, Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {
  async findById(id): Promise<UserModel> {
    return UserModel.query().findById(id);
  }

  async findByEmail(email): Promise<UserModel> {
    return UserModel.query().where('email', email).limit(1).first();
  }

  async updateUser(id: string, userData: any) {
    await UserModel.query().update(userData).where(`id`, id);

    const data = await UserModel.query().select().where('id', id);

    return { data };
  }

  async deleteUser(userID: string): Promise<number> {
    return UserModel.query().delete().where('id', userID);
  }
}
