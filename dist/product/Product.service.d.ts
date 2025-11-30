import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/CreateProductDto';
import { ApiResponseDto } from '../common/dto/response/ApiResponseDto';
import { ProductDto } from './dto/ProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { ProductListDto } from './dto/ProductListDto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProducts(options: {
        page: number;
        limit: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        order?: 'asc' | 'desc';
    }): Promise<ApiResponseDto<ProductListDto>>;
    getProductById(id: string): Promise<ApiResponseDto<ProductDto>>;
    searchProduct(page?: number, limit?: number, search?: string): Promise<ApiResponseDto<ProductListDto>>;
    createProduct(dto: CreateProductDto, userId: string): Promise<ApiResponseDto<ProductDto>>;
    updateProduct(id: string, dto: UpdateProductDto): Promise<ApiResponseDto<ProductDto>>;
    deleteProduct(id: string): Promise<ApiResponseDto<null>>;
    addProductImages(productId: string, filePaths: string[]): Promise<ApiResponseDto<ProductDto>>;
}
