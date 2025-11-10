import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/CreateProductDto';
import { ApiResponseDto } from 'src/common/dto/response/ApiResponseDto';
import { ProductDto } from './dto/ProductDto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(dto: CreateProductDto, userId: string): Promise<ApiResponseDto<ProductDto>>;
}
