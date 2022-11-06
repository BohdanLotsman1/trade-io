import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HistoryService {
  async getHistory(currfsym: string, currtsym: string) {
    try {
      let array = await axios.get(
        `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${currfsym}&tsym=${currtsym}&limit=2000&api_key=d3fc97332d795f68cd956f3d80ba98bb5b3d55992938590dbd8a1c865d00b1f5`,
      );
      
      return array.data.Data.Data.map((item) => {
        return {
          time: item.time,
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
          volumefrom: parseFloat(item.volumefrom),
        };
      });
    }
    catch (e) {
      return e
    }
  }
}
