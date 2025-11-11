import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/CreateProductDto';
import { ApiResponseDto } from '../common/dto/response/ApiResponseDto';
import { ProductDto } from './dto/ProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { ProductListDto } from './dto/ProductListDto';
import { basename } from 'path';


@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async getProducts(page = 1, limit = 10): Promise<ApiResponseDto<ProductListDto>> {

        const skip = (page - 1) * limit;

        // Fetch total count and paginated products concurrently
        const [totalProducts, products] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    stock: true,
                    category: true,
                    userId: true,
                    images: true
                },
            }),
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        // Map products to DTO
        const productList: ProductListDto = {
            currentPage: page,
            pageSize: limit,
            totalPages,
            totalProducts,
            products: products.map(product => new ProductDto({
                ...product,
                category: product.category ?? undefined,
                userId: product.userId ?? undefined
            })),
        };

        return new ApiResponseDto<ProductListDto>(
            true,
            'Products fetched successfully',
            productList,
        );
    }



    async getProductById(id: string): Promise<ApiResponseDto<ProductDto>> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                category: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return {
            success: true,
            message: 'Product detail',
            object: new ProductDto({
                ...product,
                category: product.category ?? undefined
            }),
            errors: null
        }
    }

    async searchProduct(
        page = 1,
        limit = 10,
        search?: string,
    ): Promise<ApiResponseDto<ProductListDto>> {
        const skip = (page - 1) * limit;

        const whereCondition = search
            ? {
                name: {
                    contains: search,
                    mode: 'insensitive' as const, // case-insensitive search
                },
            }
            : {};

        const [totalProducts, products] = await Promise.all([
            this.prisma.product.count({ where: whereCondition }),
            this.prisma.product.findMany({
                where: whereCondition,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    stock: true,
                    category: true,
                    userId: true
                },
            }),
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        const searchResult: ProductListDto = {
            currentPage: page,
            pageSize: limit,
            totalPages,
            totalProducts,
            products: products.map(product => new ProductDto({
                ...product,
                category: product.category ?? undefined,
                userId: product.userId ?? undefined
            })),
        };

        return {
            success: true,
            message: 'Get a List of Products',
            object: searchResult,
            errors: null
        }
    }


    async createProduct(dto: CreateProductDto, userId: string): Promise<ApiResponseDto<ProductDto>> {
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
    }

    async updateProduct(id: string, dto: UpdateProductDto): Promise<ApiResponseDto<ProductDto>> {
        const existing = await this.prisma.product.findUnique({ where: { id } });

        if (!existing) {
            throw new NotFoundException('Product not found');
        }

        // Optionally, extra validation here
        if (dto.price !== undefined && dto.price <= 0) {
            throw new BadRequestException('Price must be greater than 0');
        }
        if (dto.stock !== undefined && dto.stock < 0) {
            throw new BadRequestException('Stock cannot be negative');
        }

        const updated = await this.prisma.product.update({
            where: { id },
            data: { ...dto },
        });

        return new ApiResponseDto<ProductDto>(
            true,
            'Product updated successfully',
            new ProductDto({
                ...updated,
                category: updated.category ?? undefined,
                userId: updated.userId ?? undefined,
            }),
        );
    }

    async deleteProduct(id: string): Promise<ApiResponseDto<null>> {
        const existing = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new NotFoundException('Product not found');
        }

        await this.prisma.product.delete({
            where: { id },
        });

        return {
            success: true,
            message: 'Product deleted successfully',
            object: null,
            errors: null
        }
    }

    async addProductImage(productId: string, filePath: string): Promise<ApiResponseDto<ProductDto>> {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const fileName = basename(filePath).replace(/\\/g, '/'); // ensures forward slashes
        const imageUrl = `${baseUrl}/uploads/${fileName}`;


        const product = await this.prisma.product.update({
            where: { id: productId },
            data: {
                images: { push: imageUrl }, // append image URL
            },
        });
        return {
            success: true,
            message: 'Image uploaded',
            object: new ProductDto({
                ...product,
                category: product.category ?? undefined,
                userId: product.userId ?? undefined,
            }),
            errors: null
        };
    }

}
