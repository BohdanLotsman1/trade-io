import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { CronJob } from 'cron';
import { WsAdapter } from './modules/sockets/socket.adapter';
import { TradeService } from './modules/trade/services/trade.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const tradeService = TradeService.getInstance();
  app.useStaticAssets(path.join(__dirname, '../static'));
  var job = new CronJob('* * * * * *', function(){tradeService.chaeckTrades()}, null, true);
  app.useWebSocketAdapter(new WsAdapter(app));
  job.start();
  await app.listen(process.env.PORT || 5000);
}

bootstrap();
