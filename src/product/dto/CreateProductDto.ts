import { IsNotEmpty, IsOptional, IsPositive, Min, Length, IsString } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
    name: string;
    @IsPositive({ message: 'Price must be a positive number' })
    price: number;

    @Min(0, { message: 'Stock must be a non-negative integer' })
    stock: number;

    @IsString()
    model: string

    @IsString()
    display: string


    @IsNotEmpty()
    description: string;

    @IsOptional()
    category?: string;
}
