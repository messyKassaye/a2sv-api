import { Body, Controller, Post } from "@nestjs/common";
import { RegisterDto } from "./dto/request/register.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/request/login.dto";
import { Throttle } from "@nestjs/throttler";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @Throttle({ default: { limit: 3, ttl: 60_000 } }) // 2 requests per minute
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body)
    }


    @Post("login")
    @Throttle({ default: { limit: 5, ttl: 60_000 } }) // 5 requests per minute
    async login(@Body() body: LoginDto) {
        return this.authService.login(body)
    }

}