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
        const isUserExistByUserName = await this.prismaService.user.findUnique({
            where: {
                username: username
            }
        })

        if (isUserExistByUserName) {
            throw new BadRequestException("Username already exist")
        }

        // check if user exist by email
        const isUserExistByEmail = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })
        if (isUserExistByEmail) {
            throw new BadRequestException("Email already exist")

        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const { id, username: createdUsername, email: createdEmail } = await this.prismaService.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hashedPassword,
            },
        });

        return {
            success: true,
            message: 'User registered successfull',
            object: {
                id: id,
                username: createdUsername,
                email: createdEmail,
            },
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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials")
        }

        // JWT payload
        const jwtPayload: JwtPayload = {
            sub: user.id,
            role: user.role
        }

        const token = this.jwtService.sign(jwtPayload)

        return {
            success: true,
            message: 'Login successful',
            object: {
                accessToken: token,
            },
            errors: null
        }
    }
}
