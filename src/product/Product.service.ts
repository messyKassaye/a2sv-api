import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/CreateProductDto';
import { ApiResponseDto } from 'src/common/dto/response/ApiResponseDto';
import { ProductDto } from './dto/ProductDto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async createProduct(dto: CreateProductDto, userId: string): Promise<ApiResponseDto<ProductDto>> {
        try {
            const product = await this.prisma.product.create({
                data: { ...dto, userId },
            });

            return new ApiResponseDto<ProductDto>(
                true,
                'Product created successfully',
                new ProductDto({
                    ...product,
                    category: product.category ?? undefined,
                    userId: product.userId ?? undefined,
                }),
            );
        } catch (error) {
            throw new BadRequestException('Invalid product data');
        }
    }
}
