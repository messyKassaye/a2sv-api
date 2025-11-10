import { ProductDto } from "./ProductDto";
export declare class ProductListDto {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalProducts: number;
    products: ProductDto[];
}
