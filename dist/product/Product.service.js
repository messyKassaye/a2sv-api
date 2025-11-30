"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ApiResponseDto_1 = require("../common/dto/response/ApiResponseDto");
const ProductDto_1 = require("./dto/ProductDto");
const path_1 = require("path");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts(options) {
        const { page, limit, search, category, minPrice, maxPrice, sortBy, order } = options;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            where.category = category;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        const products = await this.prisma.product.findMany({
            where,
            orderBy: sortBy ? { [sortBy]: order || 'asc' } : { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const totalProducts = await this.prisma.product.count({ where });
        const productList = {
            currentPage: page,
            pageSize: limit,
            totalPages: totalProducts,
            totalProducts,
            products: products.map(product => new ProductDto_1.ProductDto({
                ...product,
                model: product.model ?? undefined,
                display: product.display ?? undefined,
                category: product.category ?? undefined,
                userId: product.userId ?? undefined
            })),
        };
        return new ApiResponseDto_1.ApiResponseDto(true, 'Products fetched successfully', productList);
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                category: true,
                images: true
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            success: true,
            message: 'Product detail',
            object: new ProductDto_1.ProductDto({
                ...product,
                category: product.category ?? undefined
            }),
            errors: null
        };
    }
    async searchProduct(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const whereCondition = search
            ? {
                name: {
                    contains: search,
                    mode: 'insensitive',
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
        const searchResult = {
            currentPage: page,
            pageSize: limit,
            totalPages,
            totalProducts,
            products: products.map(product => new ProductDto_1.ProductDto({
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
        };
    }
    async createProduct(dto, userId) {
        const product = await this.prisma.product.create({
            data: { ...dto, userId },
        });
        return new ApiResponseDto_1.ApiResponseDto(true, 'Product created successfully', new ProductDto_1.ProductDto({
            ...product,
            model: dto.model ?? undefined,
            display: dto.display ?? undefined,
            category: product.category ?? undefined,
            userId: product.userId ?? undefined,
        }));
    }
    async updateProduct(id, dto) {
        const existing = await this.prisma.product.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (dto.price !== undefined && dto.price <= 0) {
            throw new common_1.BadRequestException('Price must be greater than 0');
        }
        if (dto.stock !== undefined && dto.stock < 0) {
            throw new common_1.BadRequestException('Stock cannot be negative');
        }
        const updated = await this.prisma.product.update({
            where: { id },
            data: { ...dto },
        });
        return new ApiResponseDto_1.ApiResponseDto(true, 'Product updated successfully', new ProductDto_1.ProductDto({
            ...updated,
            model: updated.model ?? undefined,
            display: updated.display ?? undefined,
            category: updated.category ?? undefined,
            userId: updated.userId ?? undefined,
        }));
    }
    async deleteProduct(id) {
        const existing = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Product deleted successfully',
            object: null,
            errors: null
        };
    }
    async addProductImages(productId, filePaths) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const imageUrls = filePaths.map(filePath => {
            const fileName = (0, path_1.basename)(filePath).replace(/\\/g, '/');
            return `${baseUrl}/uploads/${fileName}`;
        });
        const product = await this.prisma.product.update({
            where: { id: productId },
            data: {
                images: { push: imageUrls },
            },
        });
        return {
            success: true,
            message: 'Images uploaded',
            object: new ProductDto_1.ProductDto({
                ...product,
                model: product.model ?? undefined,
                display: product.display ?? undefined,
                category: product.category ?? undefined,
                userId: product.userId ?? undefined,
            }),
            errors: null
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=Product.service.js.map