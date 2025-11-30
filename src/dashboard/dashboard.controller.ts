import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "src/auth/guards/jwtauth.guard";

@Controller("dashboard")
export class DashboardController {

  constructor(private readonly dashboardService: DashboardService) { }

  @Get("dashboardCards")
  async getDashboardCards(@Req() req) {
    return await this.dashboardService.getDashboardCards()

  }

}