import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsController } from './Product.controller';
import { ProductsService } from './Product.service';

@Module({
    imports: [PrismaModule],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [],
})
export class ProductModule { }
