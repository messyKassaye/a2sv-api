import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';
import { DashboardController } from './dashboard.controller';

@Module({
    imports: [PrismaModule, CommonModule],
    controllers: [DashboardController],
    providers: [DashboardService],
    exports: [],
})
export class DashboardModule { }
