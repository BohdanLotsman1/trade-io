import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObjectionModule, Model } from 'nestjs-objection';
import databaseConfig from './config/database.config';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TradeModule } from './modules/trade/trade.module';
import { UserModule } from './modules/user/user.module';
import { SocketGateway } from './modules/sockets/socket.gateway';
import { HistoryModule } from './modules/history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ObjectionModule.forRoot({
      Model,
      config: databaseConfig,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../static'),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    WalletModule,
    TradeModule,
    UserModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [SocketGateway],
})
export class AppModule {}
