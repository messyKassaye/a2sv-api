import { IsNotEmpty, IsOptional, IsPositive, Min, Length } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
    name: string;

    @IsNotEmpty()
    @Length(10, 1000, { message: 'Description must be at least 10 characters' })
    description: string;

    @IsPositive({ message: 'Price must be a positive number' })
    price: number;

    @Min(0, { message: 'Stock must be a non-negative integer' })
    stock: number;

    @IsOptional()
    category?: string;
}
