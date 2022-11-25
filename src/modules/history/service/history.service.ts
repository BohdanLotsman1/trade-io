import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HistoryService {
  async getHistory(currencyString: string) {
    try {
      const array = await axios.get(
        `https://www.binance.com/api/v3/uiKlines?limit=1000&symbol=${currencyString}&interval=1m`,
      );

      return array.data.map((item: Array<string>) => {
        return {
          time: item[0],
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
          volume: parseFloat(item[5]),
        };
      });
    } catch (e) {
      return e;
    }
  }
}
