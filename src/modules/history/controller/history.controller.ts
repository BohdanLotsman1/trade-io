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
      const history = await this.historyService.getHistory({
        currency,
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

  @Get('/listed-currencies')
  async getListedCurrencies() {
    try {
      const currencies = await this.historyService.getListedCurrencies();

      if (!currencies.length) {
        throw new BadRequestException(currencies);
      }
      return {
        data: {
          currencies,
        },
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
