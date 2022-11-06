import { IRegisterUser } from '../types';
import { HashService } from './hash.service';
import { UserModel } from '../../user/models/user.model';

export class RegisterService {
  async registerUser(request, data: IRegisterUser): Promise<UserModel> {
    data.password = HashService.hash(data.password);
    delete data.password_confirmation;

    const user = await this.createUser(data);
    return user;
  }

  async createUser(data: IRegisterUser): Promise<UserModel> {
    const user = await UserModel.query().insert(data);
    return user;
  }
}
