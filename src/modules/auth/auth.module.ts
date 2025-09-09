import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RegisterController } from './controllers/register.controller';
import { AuthController } from './controllers/auth.controller';
import { RegisterService } from './services/register.service';
import { AuthService } from './services/auth.service';
import { authVerifyMiddleware } from 'src/lib/middleware/authVerify.middleware';
// import { userVerifyMiddleware } from 'src/lib/middleware/userVerify.middleware';
import { UserService } from '../user/services/user.service';
import { WalletService } from '../wallet/services/wallet.service';
import { AppJwtModule } from './jwt/jwt.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAccessStrategy } from './jwt/jwt.strategy';
@Global()
@Module({
  providers: [
    RegisterService,
    AuthService,
    UserService,
    WalletService,
    GoogleStrategy,
    JwtAccessStrategy,
  ],
  exports: [RegisterService, AuthService],
  controllers: [RegisterController, AuthController],
  imports: [AppJwtModule, PassportModule.register({ session: false })],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    consumer
      .apply(authVerifyMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/register', method: RequestMethod.POST },
        { path: '/refresh-token', method: RequestMethod.POST },
        { path: '/history', method: RequestMethod.GET },
        { path: '/auth/google', method: RequestMethod.POST },
        { path: '/auth/google/callback', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
