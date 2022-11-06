import {
  Controller,
  Get,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { HistoryService } from '../service/history.service';

@Controller('history')
export class HistoryController {
  constructor(
    private historyService: HistoryService,
  ) {}

  @Get('/')
  async getHistory(@Query('currency') currency: string) {
    try {
      const currArray = currency.split('/');
      const history = await this.historyService.getHistory(currArray[0], currArray[1]);
      return {
        data: {
          history,
        },
      };
    } catch (e) {
      console.log(e);
      return { message: 'Get history error' };
    }
  }
}
