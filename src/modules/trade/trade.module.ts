import { Module } from '@nestjs/common';
import { TradeService } from './services/trade.service';
import { TradeController } from './controllers/trade.controller';
import { TokenService } from '../../lib/services/token.service';

@Module({
  providers: [TradeService, TokenService],
  exports: [TradeService, TokenService],
  controllers: [TradeController],
})
export class TradeModule {}
