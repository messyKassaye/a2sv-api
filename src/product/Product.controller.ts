import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Put, Param, Get, Query, Delete } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwtauth.guard';
import { CreateProductDto } from './dto/CreateProductDto';
import { ApiResponseDto } from 'src/common/dto/response/ApiResponseDto';
import { ProductDto } from './dto/ProductDto';
import { ProductsService } from './Product.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateProductDto } from './dto/UpdateProductDto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllProducts(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,

    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;

        if (search) {
            return this.productsService.searchProduct(pageNum, limitNum, search)
        } else {
            return this.productsService.getProducts(pageNum, limitNum);

        }

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
}
