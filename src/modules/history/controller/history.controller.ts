import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { HistoryService } from '../service/history.service';

@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get('/')
  async getHistory(
    @Query('currency') currency: string,
    @Query('interval') interval: string,
  ) {
    try {
      const currencyString = currency.replace('/', '');
      const history = await this.historyService.getHistory(
        currencyString,
        interval,
      );
      return {
        data: {
          history,
        },
      };
    } catch (e) {
      return { message: 'Get history error' };
    }
  }
}
