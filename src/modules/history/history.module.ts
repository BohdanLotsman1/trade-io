import { Module } from '@nestjs/common';
import { HistoryController } from './controller/history.controller';
import { HistoryService } from './service/history.service';

@Module({
  providers: [HistoryService],
  exports: [HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {}
