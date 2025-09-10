import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { HistoryService } from '../service/history.service';

@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get('/')
  async getHistory(
    @Query('currency') currency: string,
    @Query('interval') interval?: string,
    @Query('endTime') endTime?: number,
  ) {
    try {
      const currencyString = currency.replace('/', '');
      const history = await this.historyService.getHistory({
        currencyString,
        interval,
        endTime,
      });

      if (!history.length) {
        throw new BadRequestException(history);
      }
      return {
        data: {
          history,
        },
      };
    } catch (e) {
      throw new BadRequestException('Get history error');
    }
  }
}
