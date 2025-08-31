import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomerController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';
import { TokenService } from '../../lib/services/token.service';
import { AppJwtModule } from '../auth/jwt/jwt.module';

@Module({
  providers: [TokenService, WalletService],
  exports: [TokenService, WalletService],
  controllers: [CustomerController],
  imports: [AppJwtModule],
})
export class WalletModule {}
