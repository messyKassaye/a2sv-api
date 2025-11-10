import { CreateProductDto } from './dto/CreateProductDto';
import { ApiResponseDto } from 'src/common/dto/response/ApiResponseDto';
import { ProductDto } from './dto/ProductDto';
import { ProductsService } from './Product.service';
import { UpdateProductDto } from './dto/UpdateProductDto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAllProducts(page?: string, limit?: string, search?: string): Promise<ApiResponseDto<import("./dto/ProductListDto").ProductListDto>>;
    create(dto: CreateProductDto, req: any): Promise<ApiResponseDto<ProductDto>>;
    getProductById(id: string): Promise<ApiResponseDto<ProductDto>>;
    update(id: string, dto: UpdateProductDto): Promise<ApiResponseDto<ProductDto>>;
    deleteProduct(id: string): Promise<ApiResponseDto<null>>;
}
