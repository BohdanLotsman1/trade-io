import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RegisterService } from '../auth/services/register.service';
import { TokenService } from '../../lib/services/token.service';
import { UserService } from './services/user.service';

@Module({
  providers: [RegisterService, TokenService, UserService],
  exports: [RegisterService, TokenService, UserService],
  controllers: [],
  imports: [
    JwtModule.register({
      secret: 'sd54Sje_#df',
      signOptions: { expiresIn: '60m' },
    }),
  ],
})
export class UserModule {}
