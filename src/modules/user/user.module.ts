import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RegisterService } from '../auth/services/register.service';
import { UserService } from './services/user.service';
import { AppJwtModule } from '../auth/jwt/jwt.module';

@Module({
  providers: [RegisterService, UserService],
  exports: [RegisterService, UserService],
  controllers: [],
  imports: [AppJwtModule],
})
export class UserModule {}
