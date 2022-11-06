import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ITrade } from '../types';
import { TradeService } from '../services/trade.service';

@Controller('trade')
export class TradeController {
  constructor(protected tradeService: TradeService) {}

  @Get('/close/:id')
  async closeTrade(@Param('id') id: string) {
    const data = await this.tradeService.closeTrade(id);
    return { data };
  }

  @Get('/user/:id')
  async byUser(@Param('id') id: string) {
    const data = await this.tradeService.findByUser(id);
    return { data };
  }

  @Post('/')
  async add(@Body() trade: any) {
    const data = await this.tradeService.insert(trade);
    return { data };
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: any) {
    const dataobj = JSON.parse(data.payload);
    const trade = await this.tradeService.update(id, dataobj);
    return { trade };
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const data = await this.tradeService.delete(id);
    return { data };
  }
}
