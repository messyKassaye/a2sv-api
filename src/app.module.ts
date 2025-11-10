import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import * as redisStore from 'cache-manager-ioredis';
import { CacheModule } from '@nestjs/cache-manager';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig]
    }),

    AuthModule,
    PrismaModule,
    UserModule,
    CommonModule,
    ProductModule,
    OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
