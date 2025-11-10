import { Controller, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwtauth.guard";

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {

}