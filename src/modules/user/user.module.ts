import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RegisterService } from '../auth/services/register.service';
import { TokenService } from '../../lib/services/token.service';
import { UserService } from './services/user.service';
import { AppJwtModule } from '../auth/jwt/jwt.module';

@Module({
  providers: [RegisterService, TokenService, UserService],
  exports: [RegisterService, TokenService, UserService],
  controllers: [],
  imports: [AppJwtModule],
})
export class UserModule {}
