import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Put, Param, Get, Query, Delete, Inject, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwtauth.guard';
import { CreateProductDto } from './dto/CreateProductDto';
import { ApiResponseDto } from 'src/common/dto/response/ApiResponseDto';
import { ProductDto } from './dto/ProductDto';
import { ProductsService } from './Product.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateProductDto } from './dto/UpdateProductDto';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { File as MulterFile } from 'multer';



@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService, @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getProducts(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('sortBy') sortBy?: string,  // e.g., "price" or "name"
        @Query('order') order?: string,    // "asc" or "desc"

    ) {
        const cacheKey = `products_page:${page}_limit:${limit}_search:${search}`;

        // Check if the response exists in cache
        const cachedResult = await this.cacheManager.get(cacheKey);
        if (cachedResult) {
            // Return cachedResult  response if available
            return cachedResult;
        }

        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;

        // Fetch products (with or without search)
        const products = this.productsService.getProducts({
            page: pageNum,
            limit: limitNum,
            search,
            category,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            sortBy,
            order: 'asc',
        });

        // Cache the result
        await this.cacheManager.set(cacheKey, products);

        return products;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async create(
        @Body() dto: CreateProductDto,
        @Request() req,
    ): Promise<ApiResponseDto<ProductDto>> {
        return this.productsService.createProduct(dto, req.user.userId);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getProductById(@Param('id') id: string) {
        return this.productsService.getProductById(id)
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
    ) {
        return this.productsService.updateProduct(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @HttpCode(HttpStatus.OK)
    async deleteProduct(@Param('id') id: string): Promise<ApiResponseDto<null>> {
        return await this.productsService.deleteProduct(id);
    }

    @Post(':id/upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    @Roles('ADMIN')
    async uploadProductImage(@Param('id') id: string, @UploadedFile() file: MulterFile) {
        return this.productsService.addProductImage(id, file.path); // for local storage
    }
}
