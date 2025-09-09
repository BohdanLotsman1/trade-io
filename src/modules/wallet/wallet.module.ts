import { Module } from '@nestjs/common';
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';
import { AppJwtModule } from '../auth/jwt/jwt.module';

@Module({
  providers: [WalletService],
  exports: [WalletService],
  controllers: [WalletController],
  imports: [AppJwtModule],
})
export class WalletModule {}
