export declare class ProductDto {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category?: string;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ProductDto>);
}
