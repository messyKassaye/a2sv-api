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
import { ThrottlerModule } from '@nestjs/throttler';
import { DashboardModule } from './dashboard/dashboard.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig]
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // time window in seconds
        limit: 5, // default per IP (if no @Throttle decorator applied)
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // folder with your images
      serveRoot: '/uploads', // URL path
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    CommonModule,
    ProductModule,
    OrdersModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
