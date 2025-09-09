import { IRegisterUser } from '../types';
import { HashService } from './hash.service';
import { UserModel } from '../../user/models/user.model';
import { UserService } from 'src/modules/user/services/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class RegisterService {
  constructor(private readonly userService: UserService) {}
  async registerUser(data: IRegisterUser): Promise<UserModel> {
    const existing = await this.userService.findByEmail(data.email);
    if (existing?.id) throw new BadRequestException('Email already registered');
    const hashedPassword = HashService.hash(data.password);
    const userData = {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    };
    const user = await this.createUser(userData);
    return user;
  }

  async createUser(data: IRegisterUser): Promise<UserModel> {
    const user = await UserModel.query().insert(data);
    return user;
  }
}
