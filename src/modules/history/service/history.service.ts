import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HistoryService {
  async getHistory({
    currency,
    interval,
    endTime,
  }: {
    currency: string;
    interval: string;
    endTime: number;
  }) {
    try {
      const array = await axios.get(
        `https://www.binance.com/api/v3/klines?limit=1000&symbol=${currency}&interval=${interval ?? '1m'}${endTime ? `&endTime=${endTime}` : ''}`,
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
  async getListedCurrencies() {
    try {
      const { data } = await axios.get(
        'https://www.binance.com/bapi/margin/v1/friendly/isolated-margin/pair/listed',
      );

      const parsedData = data.data.map((item: any) => ({
        symbol: item.symbol,
        title: item.base + '/' + item.quote,
      }));

      return parsedData;
    } catch (e) {
      return e;
    }
  }
}
