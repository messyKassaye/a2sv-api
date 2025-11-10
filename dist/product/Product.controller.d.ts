import { CreateProductDto } from './dto/CreateProductDto';
import { ApiResponseDto } from 'src/common/dto/response/ApiResponseDto';
import { ProductDto } from './dto/ProductDto';
import { ProductsService } from './Product.service';
import { UpdateProductDto } from './dto/UpdateProductDto';
import type { Cache } from 'cache-manager';
export declare class ProductsController {
    private readonly productsService;
    private cacheManager;
    constructor(productsService: ProductsService, cacheManager: Cache);
    getAllProducts(page?: string, limit?: string, search?: string): Promise<any>;
    create(dto: CreateProductDto, req: any): Promise<ApiResponseDto<ProductDto>>;
    getProductById(id: string): Promise<ApiResponseDto<ProductDto>>;
    update(id: string, dto: UpdateProductDto): Promise<ApiResponseDto<ProductDto>>;
    deleteProduct(id: string): Promise<ApiResponseDto<null>>;
}
