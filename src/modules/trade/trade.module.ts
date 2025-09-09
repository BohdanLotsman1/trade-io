import { Module } from '@nestjs/common';
import { TradeService } from './services/trade.service';
import { TradeController } from './controllers/trade.controller';

@Module({
  providers: [TradeService],
  exports: [TradeService],
  controllers: [TradeController],
})
export class TradeModule {}
