import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/createOrderDto';
import { OrderResponseDto } from './dto/OrderResponseDto';
import { ApiResponseDto } from '../common/dto/response/ApiResponseDto';


@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async createOrder(
        dto: CreateOrderDto,
        userId: string
    ): Promise<ApiResponseDto<OrderResponseDto>> {
        return this.prisma.$transaction(async (tx) => {
            let totalPrice = 0;

            // Prepare order items data
            const orderItemsData = await Promise.all(
                dto.items.map(async (item) => {
                    const product = await tx.product.findUnique({ where: { id: item.productId } });

                    if (!product) {
                        throw new NotFoundException(`Product not found: ${item.productId}`);
                    }

                    if (product.stock < item.quantity) {
                        throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
                    }

                    // Calculate total price
                    totalPrice += product.price * item.quantity;

                    // Deduct stock
                    await tx.product.update({
                        where: { id: product.id },
                        data: { stock: product.stock - item.quantity },
                    });

                    return {
                        productId: product.id,
                        quantity: item.quantity,
                    };
                })
            );

            // Create order with items
            const order = await tx.order.create({
                data: {
                    userId,
                    totalPrice,
                    description: dto.description || 'No description',
                    status: 'pending',
                    orderItems: {
                        create: orderItemsData,
                    },
                },
                include: {
                    orderItems: true,
                },
            });

            // Map order to response DTO
            const orderResponse = new OrderResponseDto({
                id: order.id,
                userId: order.userId,
                totalAmount: order.totalPrice,
                status: order.status,
                items: order.orderItems.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                })),
                createdAt: order.createdAt,
            });

            return new ApiResponseDto<OrderResponseDto>(
                true,
                'Order placed successfully',
                orderResponse,
            );
        });
    }



    async getUserOrders(userId: string): Promise<ApiResponseDto<any[]>> {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                status: true,
                totalPrice: true,
                createdAt: true,
                orderItems: {
                    select: {
                        productId: true,
                        quantity: true,
                    },
                },
            },
        });

        return new ApiResponseDto<any[]>(
            true,
            'Orders retrieved successfully',
            orders,
        );
    }

}
