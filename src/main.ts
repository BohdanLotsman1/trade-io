import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { CronJob } from 'cron';
import { TradeService } from './modules/trade/services/trade.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  });
  const tradeService = TradeService.getInstance();
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useStaticAssets(path.join(__dirname, '../static'));
  const job = new CronJob(
    '* * * * * *',
    function () {
      tradeService.chaeckTrades();
    },
    null,
    true,
  );
  job.start();
  await app.listen(process.env.PORT || 5001);
}

bootstrap();
