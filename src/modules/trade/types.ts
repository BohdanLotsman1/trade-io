export interface ITrade {
  id: string;
  trade_price: number;
  direction: number;
  user_id: string;
  state: string;
  price_on_close: number;
  result: string;
  price_on_open: number;
  time: string;
  end_time: string;
  currency: string;
}
