import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IDashboardCard } from "./dto/IDashboardCard";
import { ResponseDto } from "src/common/dto/response/ResponseDto";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

  private calculateChange(current: number, previous: number): string {
    if (previous <= 0) return '0';
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  }

  async getDashboardCards(): Promise<ResponseDto<IDashboardCard[]>> {
    const cards: IDashboardCard[] = [];





    cards.push({
      name: 'Number of vistors',
      value: '12,343',
      change: `from last month`,
    });



    cards.push({
      name: 'Number of products',
      value: '21432',
    });


    cards.push({
      name: "Total Orders",
      value: '12141',
      change: `% from yesterday`,
    });


    cards.push({
      name: "Total Contact message",
      value: `2141`,
      change: ` from yesterday`,
    });

    // ✅ Final Response
    return {
      status: true,
      message: 'Dashboard summary data',
      data: cards,
      statusCode: 200,
    };
  }

}