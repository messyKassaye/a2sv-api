import { ProductDto } from "./ProductDto"

export class ProductListDto {
    currentPage: number
    pageSize: number
    totalPages: number
    totalProducts: number
    products: ProductDto[]
}