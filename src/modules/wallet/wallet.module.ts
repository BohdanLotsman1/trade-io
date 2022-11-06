import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomerController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';
import { TokenService } from '../../lib/services/token.service';

@Module({
  providers: [TokenService, WalletService],
  exports: [TokenService, WalletService],
  controllers: [CustomerController],
  imports: [
    JwtModule.register({
      secret: 'sd54Sje_#df',
      signOptions: { expiresIn: '60m' },
    }),
  ],
})
export class WalletModule {}
