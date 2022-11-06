import { Injectable } from '@nestjs/common';
import { ITrade } from '../types';
import { TradeModel } from '../models/trade.model';
import { WalletModel } from 'src/modules/wallet/models/wallet.model';
import * as moment from 'moment';
import { currPrice } from 'src/modules/common/curPrice';

@Injectable()
export class TradeService {
  static _instance: TradeService;

  API_ROUTE = process.env.REACT_APP_API_HOST;

  static getInstance(): TradeService {
    if (!TradeService._instance) {
      TradeService._instance = new TradeService();
    }
    return TradeService._instance;
  }
  async findById(id: string): Promise<TradeModel> {
    return TradeModel.query().select().where('id', id).first();
  }

  async findByUser(id: string): Promise<TradeModel[]> {
    return TradeModel.query()
      .select()
      .where('user_id', id)
      .orderBy('end_time', 'DESC');
  }

  async closeTrade(id: string): Promise<any> {
    const trade = await TradeModel.query().select().where('id', id).first();
    const amount = await WalletModel.query()
      .select()
      .where('user_id', trade.user_id)
      .first();
    amount.amount_of_money = amount.amount_of_money + trade.trade_price;
    await WalletModel.query().update(amount).where('user_id', trade.user_id);

    const coeff = Boolean(trade.direction) ? 1 : -1;
    let curr = trade.currency.replace('/', '');
    if ((currPrice[curr] - trade.price_on_open) * coeff > 0) {
      await TradeModel.query()
        .update({
          state: 'CLOSED',
          price_on_close: currPrice[curr],
          result: 'WIN',
          end_time: moment().format(),
        })
        .where('id', trade.id);
    } else {
      await TradeModel.query()
        .update({
          state: 'CLOSED',
          price_on_close: currPrice[curr],
          result: 'LOSE',
          end_time: moment().format(),
        })
        .where('id', trade.id);
    }

    const newTrades = await TradeModel.query()
      .select()
      .where('user_id', trade.user_id)
      .orderBy('end_time', 'DESC');
    const currWallet = await WalletModel.query().select().where('user_id', trade.user_id).first();
    return {trades: newTrades, wallet: currWallet };
  }

  async insert(data: TradeModel): Promise<TradeModel> {
    const trade = await TradeModel.query().insert(data);
    const amount = await WalletModel.query()
      .select()
      .where('user_id', data.user_id)
      .first();
    amount.amount_of_money = amount.amount_of_money - data.trade_price;
    await WalletModel.query().update(amount).where('user_id', data.user_id);
    return TradeModel.query().select().where('id', trade.id).first();
  }

  async update(id: string, data: ITrade): Promise<TradeModel> {
    await TradeModel.query().update(data).where('id', id);
    return TradeModel.query().select().where('id', id).first();
  }

  async delete(id) {
    return TradeModel.query().delete().where('id', id);
  }

  async chaeckTrades() {
    const openedTrades = await TradeModel.query()
      .select()
      .where('state', 'OPENED')
      .where('end_time', '<=', moment().format());
    openedTrades.map(async (item) => {
      let curr = item.currency.replace('/', '');
      var currentAmount = await WalletModel.query()
        .select()
        .where('user_id', item.user_id);
      const coeff = Boolean(item.direction) ? 1 : -1;

      if ((currPrice[curr] - item.price_on_open) * coeff > 0) {
        await TradeModel.query()
          .update({
            state: 'CLOSED',
            price_on_close: currPrice[curr],
            result: 'WIN',
          })
          .where('id', item.id);
        await WalletModel.query()
          .update({
            amount_of_money:
              currentAmount[0].amount_of_money +
              (item.trade_price / 100) * 82 +
              item.trade_price,
          })
          .where('user_id', item.user_id);
      } else {
        await TradeModel.query()
          .update({
            state: 'CLOSED',
            price_on_close: currPrice[curr],
            result: 'LOSE',
          })
          .where('id', item.id);
      }
    });
  }
}
