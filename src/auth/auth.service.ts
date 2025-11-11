import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/request/register.dto';
import * as bcrypt from 'bcryptjs';
import { UserDto } from 'src/user/dto/response/UserDto';
import { LoginDto } from './dto/request/login.dto';
import { LoginResponseDto } from './dto/response/LoginResponse';
import { ApiResponseDto } from 'src/common/dto/response/ApiResponseDto';
import { JwtPayload } from './dto/response/JwtPayload.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) { }

    async register(dto: RegisterDto): Promise<ApiResponseDto<UserDto>> {
        const { username, email, password } = dto

        // check if user exist by username
        const existingUserByUsername = await this.prismaService.user.findUnique({
            where: {
                username: username
            }
        })

        if (existingUserByUsername) {
            throw new BadRequestException("Username already exist")
        }

        // check if user exist by email
        const existingUserByEmail = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })
        if (existingUserByEmail) {
            throw new BadRequestException("Email already exist")

        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // registered user
        const registeredUser = await this.prismaService.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });

        return {
            success: true,
            message: 'User registered successfully',
            object: registeredUser,
            errors: null
        }
    }

    async login(dto: LoginDto): Promise<ApiResponseDto<LoginResponseDto>> {
        const { email, password } = dto

        // Find user by email
        const user = await this.prismaService.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // JWT payload
        const jwtPayload: JwtPayload = {
            sub: user.id,
            role: user.role
        }

        const accessToken = this.jwtService.sign(jwtPayload)

        return {
            success: true,
            message: 'Login successful',
            object: {
                accessToken,
            },
            errors: null
        }
    }
}
