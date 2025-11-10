import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsController } from './Product.controller';
import { ProductsService } from './Product.service';
import * as redisStore from 'cache-manager-ioredis';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        PrismaModule,
        CacheModule.registerAsync({
            useFactory: () => ({
                store: redisStore,
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
                ttl: Number(process.env.REDIS_TTL) || 60, // in seconds
            }),
        }),
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [],
})
export class ProductModule { }
