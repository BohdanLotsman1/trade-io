import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HistoryService {
  async getHistory({
    currencyString,
    interval,
    endTime,
  }: {
    currencyString: string;
    interval: string;
    endTime: number;
  }) {
    try {
      const array = await axios.get(
        `https://www.binance.com/api/v3/klines?limit=1000&symbol=${currencyString}&interval=${interval ?? '1m'}${endTime ? `&endTime=${endTime}` : ''}`,
      );
      return array.data.map((item: Array<string>) => ({
        time: item[0],
        open: Number(item[1]),
        high: Number(item[2]),
        low: Number(item[3]),
        close: Number(item[4]),
        volume: Number(item[5]),
      }));
    } catch (e) {
      return e;
    }
  }
}
